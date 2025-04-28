import { createContext, useState, useEffect, ReactNode } from 'react';
import { ITransaction, ICategory, IData } from '../utils/interfaces';
import axios from 'axios';
import moment from 'moment';
import {
  calculateTransactionTotal,
  sortTransactionsByRecent,
} from '../utils/helperFunctions';

export const DataContext = createContext<IData | null>(null);

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [transactionsRes, categoriesRes] = await Promise.all([
        axios.post('/data-transactions', {
          month: moment().month() + 1,
          year: moment().year(),
        }),
        axios.get('/data-categories'),
      ]);

      const fetchedTransactions = transactionsRes.data as ITransaction[];
      let fetchedCategories = categoriesRes.data as ICategory[];

      // Process categories
      let processedCategories: ICategory[] = [];

      fetchedCategories.forEach((category: ICategory) => {
        const filteredTransactions = fetchedTransactions.filter(
          (transaction) => Number(transaction.categoryId) === category.id
        );

        const processedCategory = {
          id: category.id,
          categoryName: category.categoryName,
          limit: Number(category.limit),
          transactions: sortTransactionsByRecent(filteredTransactions),
          totalTransactionAmount:
            calculateTransactionTotal(filteredTransactions),
          note: category.note,
        };

        processedCategories.push(processedCategory);
      });

      setTransactions(fetchedTransactions);
      setCategories(processedCategories);

      console.log('New Data Fetched');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value: IData = {
    transactions,
    categories,
    loading,
    setLoading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
