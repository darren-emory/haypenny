import { useState, useEffect } from 'react';
import { ICategory, ITransaction } from './utils/interfaces';
import EditCategoryModal from './components/EditCategoryModal';
import {
  sortTransactionsByAmount,
  sortTransactionsByRecent,
} from './utils/helperFunctions';
import Transaction from './Transaction';
import Gear from '../icons/Gear';
import Modal from './components/Modal';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

type Props = {
  category: ICategory;
};

function Category({ category }: Props) {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null);
  const [sortByDate, setSortByDate] = useState<boolean>(true);

  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [sortedTransactions, setSortedTransactions] = useState<
    ITransaction[] | null
  >(null);

  useEffect(() => {
    if (Number(categoryId) === category.id) {
      setActiveCategory(category);
      setSortedTransactions(category.transactions ?? []);
    } else {
      setActiveCategory(null);
      setSortedTransactions(null);
    }
  }, [categoryId]);

  useEffect(() => {
    if (sortByDate) {
      setSortedTransactions(() => {
        return [
          ...sortTransactionsByRecent(activeCategory?.transactions ?? []),
        ];
      });
    } else {
      setSortedTransactions(() => {
        return [
          ...sortTransactionsByAmount(activeCategory?.transactions ?? []),
        ];
      });
    }
  }, [sortByDate]);

  return (
    <div
      key={category.id}
      className="category-grid-item"
      // style={{
      //   backgroundImage:
      //     'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 50%, rgba(255,255,255,0.2) 20%)',
      // }}
      onClick={() => {
        editCategoryModalOpen && setEditCategoryModalOpen(false);
        if (Number(categoryId) === category.id) {
          navigate(`/`);
        } else {
          navigate(`/view-category/${category.id}`);
        }
      }}
    >
      <div
        className={
          activeCategory
            ? 'category-grid-item-header active'
            : 'category-grid-item-header'
        }
      >
        <div className="category-grid-title">
          <h3>{category.categoryName}</h3>

          {activeCategory?.note !== undefined && <p>{activeCategory?.note}</p>}
        </div>
        <div className="category-grid-amount">
          <h4>
            <span
              style={{
                color:
                  category.totalTransactionAmount &&
                  category.totalTransactionAmount > category.limit
                    ? '#c6573b'
                    : 'black',
              }}
            >
              {category.totalTransactionAmount === 0
                ? 0
                : category.totalTransactionAmount?.toFixed(2)}
            </span>
            <span
              style={{ color: '#7b7260', fontSize: '30px' }}
            >{` / ${category.limit}`}</span>
          </h4>
          <div className="category-options">
            {activeCategory &&
              category.totalTransactionAmount !== undefined && (
                <h6>
                  {Math.abs(
                    Number(
                      (
                        activeCategory.limit - category.totalTransactionAmount
                      ).toFixed(2)
                    )
                  )}
                  {category.totalTransactionAmount > category.limit
                    ? ' Overspent '
                    : ' Left '}
                </h6>
              )}
            {activeCategory && (
              <button
                className="mini-icon"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setEditCategoryModalOpen(true);
                }}
              >
                <Gear />
              </button>
            )}
          </div>
        </div>
      </div>

      {activeCategory && (
        <>
          {editCategoryModalOpen && (
            <Modal title="Edit Category" onClose={setEditCategoryModalOpen}>
              <EditCategoryModal selectedCategory={activeCategory} />
            </Modal>
          )}
          <div className="category-view">
            <div className="transactions-container">
              {activeCategory.transactions &&
              activeCategory.transactions.length > 0 ? (
                activeCategory.transactions.map((transaction: ITransaction) => (
                  <Transaction
                    key={transaction.transactionId}
                    transaction={transaction}
                    setSortedTransactions={setSortedTransactions}
                  />
                ))
              ) : (
                <div className="transaction">
                  <div className="transaction-title">
                    <h6>No transactions found.</h6>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Category;
