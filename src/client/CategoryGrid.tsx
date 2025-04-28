import { ICategory, IData } from './utils/interfaces';
import Category from './Category';

type Props = {
  data: IData | null;
};

function CategoryGrid({ data }: Props) {
  return (
    <>
      {data &&
        data.categories.length > 0 &&
        data.categories.map((category: ICategory) => {
          return <Category key={category.id} category={category} />;
        })}
    </>
  );
}

export default CategoryGrid;
