import { useState, useEffect } from 'react';
import { ICategory } from '../utils/interfaces';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/ModalStyles.css';
import CheckMark from '../../icons/CheckMark';

type Props = {
  selectedCategory: ICategory;
};

function EditCategoryModal({ selectedCategory }: Props) {
  const [updatedCategory, setUpdatedCategory] =
    useState<ICategory>(selectedCategory);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <p>
        <label htmlFor="categoryName">Category Name:</label>
        <input
          value={updatedCategory.categoryName || ''}
          id="categoryName"
          type="text"
          onChange={(e) =>
            setUpdatedCategory((prev: any) =>
              prev ? { ...prev, categoryName: e.target.value } : ''
            )
          }
        />
      </p>
      <p>
        <label htmlFor="limit">Limit:</label>
        <input
          id="limit"
          type="text"
          value={updatedCategory.limit || ''}
          onChange={(e) =>
            setUpdatedCategory((prev: any) =>
              prev
                ? {
                    ...prev,
                    limit: Number(e.target.value),
                  }
                : ''
            )
          }
        />
      </p>
      <p>
        <label htmlFor="note">Note:</label>{' '}
        <textarea
          id="note"
          value={updatedCategory.note || ''}
          onChange={(e) =>
            setUpdatedCategory((prev: any) =>
              prev
                ? {
                    ...prev,
                    note: e.target.value,
                  }
                : ''
            )
          }
        />
      </p>
      <p className="submit-container">
        <button
          className="round xlarge"
          type="submit"
          onClick={() => {
            axios({
              method: 'put',
              url: '/data-update-category',
              data: updatedCategory,
            })
              .then(() => navigate(0))
              .catch((error) => console.error(error));
          }}
        >
          <CheckMark theme="light" />
        </button>
      </p>
    </form>
  );
}

export default EditCategoryModal;
