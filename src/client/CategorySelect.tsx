import { ICategory, ITransaction } from './utils/interfaces';
import useDataContext from './hooks/useDataContext';

type Props = {
  onChange: (categoryId: number, transaction: ITransaction) => void;
  transaction: ITransaction;
};

function CategorySelect({ transaction, onChange }: Props) {
  const allData = useDataContext();

  return (
    <select
      id="categorySelect"
      name="categorySelect"
      onChange={(e) => onChange(Number(e.target.value), transaction)}
      defaultValue={transaction.categoryId}
    >
      {!transaction.categoryId && <option>Select a category...</option>}
      {allData?.categories.map((category: ICategory) => (
        <option key={category.id} value={category.id}>
          {category.categoryName}
        </option>
      ))}
    </select>
  );
}

export default CategorySelect;
