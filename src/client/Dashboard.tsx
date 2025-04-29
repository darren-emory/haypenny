import { useState, useContext, useEffect } from 'react';
import { ICategory, ITransaction } from './utils/interfaces';
import CategoryGrid from './CategoryGrid';
import { useNavigate } from 'react-router-dom';
import { calculateTransactionTotal } from './utils/helperFunctions';
import moment from 'moment';

import './styles/DashboardStyles.css';
import Upload from '../icons/Upload';
import useDataContext from './hooks/useDataContext';

function Dashboard() {
  const navigate = useNavigate();
  const allData = useDataContext();

  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  useEffect(() => {
    allData && setCategories(allData.categories);
  }, [allData]);

  return (
    <div className="dashboard">
      <>
        <header className="">
          <h2>{moment().format('MMMM DD, YYYY')}</h2>
          <h1>
            {calculateTransactionTotal(
              allData?.transactions.filter(
                (transaction: ITransaction) =>
                  Number(transaction.categoryId) !== 18
              )
            )}
          </h1>
        </header>

        <div className="category-grid-container">
          <CategoryGrid data={allData} />
        </div>

        <button
          className="upload round large"
          type="submit"
          onClick={() => {
            navigate('/upload');
          }}
        >
          <Upload theme="light" />
        </button>
      </>
    </div>
  );
}

export default Dashboard;
