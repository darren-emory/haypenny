import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITransaction } from '../utils/interfaces';
import moment from 'moment';
import CheckMark from '../../icons/CheckMark';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

type Props = {
  originalTransaction: ITransaction;
  setSortedTransactions: (transactions: any) => void;
};

function SplitTransactionModal({
  originalTransaction,
  setSortedTransactions,
}: Props) {
  const [originalTransactionNewAmount, setOriginalTransactionNewAmount] =
    useState<number>(originalTransaction.amount);
  const [splitTransactions, setSplitTransactions] = useState<ITransaction[]>([
    {
      transactionId: uuidv4(),
      description: '',
      note: `Split from ${originalTransaction.amount} on ${moment(
        originalTransaction.date
      ).format('MM/DD/YYYY')} - ${originalTransaction.description.slice(
        0,
        10
      )}...`,
      date: originalTransaction.date,
      isHidden: '1', // mysql boolean is 0 for false and 1 for true
      amount: 0,
      categoryId: undefined,
      parentId: originalTransaction.transactionId,
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    let updatedAmount =
      originalTransaction.amount -
      splitTransactions.reduce((a, b) => a + b.amount, 0);
    setOriginalTransactionNewAmount(updatedAmount);
  }, [splitTransactions]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div
        className="transaction highlight"
        key={originalTransaction.transactionId}
      >
        <h2>
          {Number(originalTransactionNewAmount).toFixed(2)} &bull;{' '}
          {moment(originalTransaction.date).format('MM/DD/YYYY')}
        </h2>
        <h6>{originalTransaction.description}</h6>
      </div>
      {splitTransactions.length > 0 &&
        splitTransactions.map((splitTransaction, index) => {
          return (
            <div className="transaction" key={index}>
              <div className="transaction-header">
                <h3>Split Transaction #{index + 1}:</h3>
                <button
                  className="secondary"
                  onClick={() => {
                    setSplitTransactions(() => {
                      let updatedTransactions = splitTransactions.filter(
                        (t) =>
                          t.transactionId !==
                          splitTransactions[index].transactionId
                      );
                      return updatedTransactions;
                    });
                  }}
                >
                  Delete
                </button>
              </div>

              <p>
                <label htmlFor={`amount-${index}`}>Amount:</label>
                <input
                  type="number"
                  id={`amount-${index}`}
                  step="any"
                  inputMode="decimal"
                  value={
                    splitTransaction.amount === 0 ? '' : splitTransaction.amount
                  }
                  onWheel={(e) =>
                    e.target instanceof HTMLElement && e.target.blur()
                  }
                  onChange={(e) => {
                    const updatedAmount = e.target.value;
                    setSplitTransactions((prev) =>
                      prev.map((transaction, i) =>
                        i === index
                          ? {
                              ...transaction,
                              amount:
                                updatedAmount === ''
                                  ? 0
                                  : Number(updatedAmount),
                            }
                          : transaction
                      )
                    );
                  }}
                />
              </p>

              <p>
                <label htmlFor={`description-${index}`}>Description:</label>{' '}
                <input
                  type="text"
                  id={`description-${index}`}
                  value={splitTransaction.description}
                  onChange={(e) => {
                    const updatedDescription =
                      e.target.value !== 'null' ? e.target.value : '';
                    setSplitTransactions((prev) =>
                      prev.map((transaction, i) =>
                        i === index
                          ? { ...transaction, description: updatedDescription }
                          : transaction
                      )
                    );
                  }}
                />
              </p>
            </div>
          );
        })}

      <div className="transaction-header">
        <h3>Add another transaction?</h3>
        <button
          className="secondary"
          onClick={() => {
            setSplitTransactions((prev) => {
              const blankTransaction = {
                ...prev[0],
                transactionId: uuidv4(),
                description: '',
                amount: 0,
              };
              return [...prev, blankTransaction];
            });
          }}
        >
          Add
        </button>
      </div>

      <p className="submit-container">
        <button
          className="round xlarge"
          type="submit"
          onClick={() => {
            let updatedTransactions = splitTransactions.map(
              (transaction, index) => ({
                ...transaction,
                transactionId:
                  originalTransaction.transactionId + '-' + (index + 1),
              })
            );

            updatedTransactions.unshift({
              ...originalTransaction,
              parentId: originalTransaction.transactionId,
              transactionId: originalTransaction.transactionId + '-0',
              amount: originalTransactionNewAmount,
            });

            axios({
              method: 'put',
              url: '/data-update-transaction',
              data: {
                ...originalTransaction,
                isHidden: '1',
                note: `Split into ${splitTransactions.length} transactions.`,
              },
            })
              .then((response) => {
                console.log(response);
                navigate('/process-transactions/split', {
                  state: { results: updatedTransactions },
                });
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

export default SplitTransactionModal;
