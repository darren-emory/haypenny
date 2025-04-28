import {
  ReactNode,
  PropsWithChildren,
  useState,
  createContext,
  useEffect,
} from 'react';
import { ITransaction, ICategory, IData } from './utils/interfaces';
import axios from 'axios';
import moment from 'moment';
import {
  calculateTransactionTotal,
  sortTransactionsByRecent,
} from './utils/helperFunctions';

export const DataContext = createContext<IData | null>(null);

type Props = {
  children?: ReactNode;
};

function DataContextProvider(props: PropsWithChildren<Props>) {
  const [data, setData] = useState<IData | undefined>(undefined);

  const fetchData = async () => {
    setData(undefined);

    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        axios.post('/data-transactions', {
          month: moment().month() + 1,
          year: moment().year(),
        }),
        axios.get('/data-categories'),
      ]);

      const fetchedData = {
        transactions: transactionsRes.data as ITransaction[],
        categories: categoriesRes.data as ICategory[],
      };

      // add relevant transactions to each category
      let processedCategories: ICategory[] | [] = [];

      fetchedData.categories.forEach((category: ICategory) => {
        let filteredTransactions = fetchedData?.transactions.filter(
          (transaction) => {
            return Number(transaction.categoryId) === category.id;
          }
        );

        let processedCategory = {
          id: category.id,
          categoryName: category.categoryName,
          limit: Number(category.limit),
          transactions: sortTransactionsByRecent(filteredTransactions),
          totalTransactionAmount: calculateTransactionTotal(
            filteredTransactions ? filteredTransactions : []
          ),
          note: category.note,
        };

        processedCategories = [...processedCategories, processedCategory];
      });

      fetchedData.categories = processedCategories;

      setData(fetchedData);
      console.log('New Data Fetched');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={data || null}>
      {props.children}
    </DataContext.Provider>
  );
}

export default DataContextProvider;
