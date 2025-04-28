import { ITransaction, ICategory } from './interfaces';
import moment from 'moment';

export const createTransactionId = (t: any) => {
  return (
    t[3].replace(/^[^-]*- /, '').slice(0, 2) +
    t[1].split('/').join('') +
    t[7].slice(1, 5).split('.').join('')
  );
};

export const sortTransactionsByRecent = (transactions: Array<ITransaction>) => {
  let sortedArray = transactions.sort((a, b) => {
    const dateDiff = moment(b.date).diff(moment(a.date));
    if (dateDiff === 0) {
      return a.description.localeCompare(b.description);
    }
    return dateDiff;
  });

  return sortedArray;
};

export const sortTransactionsByAmount = (transactions: Array<ITransaction>) => {
  // sort by amount and return sorted array
  let sortedArray = transactions.sort((a, b) => {
    const amountDiff = b.amount - a.amount;
    if (amountDiff === 0) {
      return a.description.localeCompare(b.description);
    }
    return amountDiff;
  });
  return sortedArray;
};

// these two should be combined eventually
export const calculateCategoryTotal = (categories: ICategory[] | undefined) => {
  let total = 0;
  categories?.forEach((row: any) => {
    if (row.isHidden === '1') {
      return;
    }
    total += Number(row.limit);
  });

  return Number(total.toFixed(2));
};

export const calculateTransactionTotal = (
  transactions: ITransaction[] | undefined
) => {
  let total = 0;
  transactions?.forEach((row: any) => {
    if (row.isHidden === '1') {
      return;
    }
    total += Number(row.amount);
  });

  return Number(total.toFixed(2));
};
