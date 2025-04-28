import { useState, useContext, useEffect } from 'react';
import ViewCategory from './Category';
import { Category, Data, Transaction } from './utils/interfaces';
import CategoryGrid from './CategoryGrid';
import { DataContext } from './DataContextProvider';
import {
  calculateCategoryTotal,
  calculateTransactionTotal,
} from './utils/helperFunctions';
import moment from 'moment';

function OldDashboard() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  const allData = useContext(DataContext);

  const handleViewCategory = (id: number) => {
    let filteredCategory = categories?.filter((category) => {
      return category.id === id;
    });

    setActiveCategory(filteredCategory ? filteredCategory[0] : null);
  };

  useEffect(() => {
    allData && setCategories(allData.categories);
  }, [allData]);

  return (
    <>
      {activeCategory !== null ? (
        <>
          <ViewCategory />
        </>
      ) : (
        categories && (
          <>
            <h1>{moment().format('MMMM YYYY')}</h1>
            <h2>
              You have spent $
              {calculateTransactionTotal(
                allData?.transactions.filter(
                  (transaction) => Number(transaction.categoryId) !== 18
                )
              )}{' '}
              this month out of ${calculateCategoryTotal(allData?.categories)}.
            </h2>
            <div className="category-grid-container">
              <CategoryGrid data={categories} onClick={handleViewCategory} />
            </div>
          </>
        )
      )}
    </>
  );
}

export default OldDashboard;
