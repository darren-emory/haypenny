import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITransaction } from '../utils/interfaces';
import axios from 'axios';
import moment from 'moment';
import CheckMark from '../../icons/CheckMark';

import CategorySelect from '../CategorySelect';

type Props = {
  transaction: ITransaction;
  setSortedTransactions: (transactions: any) => void;
};

function EditTransactionModal({ transaction, setSortedTransactions }: Props) {
  const [editedTransaction, setEditedTransaction] = useState(transaction);

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
        <label>Description:</label>
        <strong>{editedTransaction.description}</strong>
      </p>
      <p>
        <label>Date:</label>
        <strong>{moment(editedTransaction.date).format('MM/DD/YYYY')}</strong>
      </p>
      <p>
        <label htmlFor="categorySelect">Category:</label>
        <CategorySelect
          transaction={editedTransaction}
          onChange={(categoryId, transaction) => {
            setEditedTransaction((prev: any) =>
              prev
                ? {
                    ...prev,
                    categoryId: categoryId,
                  }
                : null
            );
          }}
        />
      </p>
      <p>
        <label htmlFor="">Amount:</label>
        <strong>${editedTransaction.amount}</strong>
      </p>

      <p>
        <label htmlFor="note">Note:</label>
        <textarea
          id="note"
          value={
            editedTransaction.note !== 'null' || editedTransaction.note
              ? editedTransaction.note
              : ''
          }
          onChange={(e) =>
            setEditedTransaction((prev: any) =>
              prev
                ? {
                    ...prev,
                    note: e.target.value !== 'null' ? e.target.value : '',
                  }
                : null
            )
          }
        />
      </p>
      <p className="inline-input">
        <input
          type="checkbox"
          id="hide-transaction"
          checked={editedTransaction.isHidden == '1'}
          onChange={(e) =>
            setEditedTransaction((prev: any) =>
              prev
                ? {
                    ...prev,
                    isHidden: e.target.checked ? '1' : '0',
                  }
                : null
            )
          }
        />
        <label htmlFor="hide-transaction">Hide Transaction</label>
      </p>
      <p className="submit-container">
        <button
          className="round xlarge"
          type="submit"
          onClick={() => {
            axios({
              method: 'put',
              url: '/data-update-transaction',
              data: editedTransaction,
            })
              .then((response) => {
                console.log(response);
                setSortedTransactions((prev: ITransaction[]) =>
                  prev.map((transaction: ITransaction) =>
                    transaction.transactionId ===
                    editedTransaction.transactionId
                      ? editedTransaction
                      : transaction
                  )
                );
                navigate(0);
              })
              .catch((error) => console.error(error));
          }}
        >
          <CheckMark theme="light" />
        </button>
      </p>
    </form>
  );
}

export default EditTransactionModal;
