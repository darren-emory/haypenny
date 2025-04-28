export interface ITransaction {
  transactionId: string;
  description: string;
  note: string | undefined;
  date: string;
  isHidden: string; // mysql boolean is 0 for false and 1 for true
  amount: number;
  categoryId: number | undefined;
  parentId: string | undefined; // if transaction is split, it has original transaction id here
}

export interface ICategory {
  categoryName: string;
  id: number;
  limit: number;
  totalTransactionAmount?: number;
  transactions?: ITransaction[];
  note: string | undefined;
}

export interface IData {
  transactions: ITransaction[];
  categories: ICategory[];
  loading: boolean;
  setLoading: (value: boolean) => void;
}
