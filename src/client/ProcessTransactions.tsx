import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ICategory, ITransaction } from './utils/interfaces';
import CategorySelect from './CategorySelect';
import moment from 'moment';
import Modal from './components/Modal';
import {
  createTransactionId,
  sortTransactionsByRecent,
} from './utils/helperFunctions';

function ProcessTransactions() {
  const navigate = useNavigate();

  // data is passed from Upload or SplitTransactionModal
  const { state } = useLocation();

  // this URL param is passed if we are splitting an existing transaction into multiple
  const { processParam } = useParams();
  const shouldSplitTransactions = processParam === 'split';

  const [existingTransactions, setExistingTransactions] = useState(
    Array<ITransaction>
  );
  const [transactions, setTransactions] = useState(Array<ITransaction>);
  const [categories, setCategories] = useState(Array<ICategory>);

  const processTransactions = (results: any) => {
    let updatedData: ITransaction[] = [];

    // if not splitting transactions, processes raw CSV data from { state } param
    if (!shouldSplitTransactions) {
      results.forEach((row: string[]) => {
        //  checks if transaction is a debit and that it doesn't already exist before processing
        if (
          row[4] !== '' &&
          existingTransactions.find(
            (t) => t.transactionId === createTransactionId(row)
          ) === undefined
        ) {
          let processedRow = {
            transactionId: createTransactionId(row),
            description: row[3].replace(/^[^-]*- /, ''),
            amount: Number(row[4]),
            date: moment(row[1]).format('YYYY-MM-DD'),
            categoryId: undefined,
            isHidden: '0',
            parentId: '',
            note: '',
          } as ITransaction;

          updatedData.push(processedRow);
        }
      });
    } else {
      updatedData = results;
    }
    setTransactions(sortTransactionsByRecent(updatedData));
  };

  // the final step to import transactions
  const finalizeTransactions = () => {
    transactions.forEach((transaction) => {
      {
        axios({
          method: 'put',
          url: '/data-create-transaction',
          data: {
            ...transaction,
            date: moment(transaction.date).format('YYYY-MM-DD'),
          },
        })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => console.error(error));
      }
    });

    // if not splitting transactions, update last import date. Redirect to dashboard and refresh
    if (!shouldSplitTransactions) {
      axios({
        method: 'put',
        url: '/data-update-last-import',
        data: {
          lastImportDate: `${moment().format('YYYY-MM-DD')}`,
        },
      })
        .then(
          (response) => (
            console.log(response), navigate('/'), window.location.reload()
          )
        )
        .catch((error) => console.error(error));
    } else {
      navigate('/');
      window.location.reload();
    }
  };

  // assigns a categoryId to an incoming transaction, sorts and updates state
  const addCategoryToTransaction = (
    categoryId: number,
    transaction: ITransaction
  ) => {
    if (transaction) {
      let updatedTransaction = {
        ...transaction,
        categoryId: categoryId,
      };

      let updatedTransactions = transactions.filter(
        (t) => t.transactionId !== updatedTransaction.transactionId
      );

      updatedTransactions.push(updatedTransaction);

      setTransactions(
        updatedTransactions.sort((a, b) => {
          const dateDiff = moment(b.date).diff(moment(a.date));
          if (dateDiff === 0) {
            return a.description.localeCompare(b.description);
          }
          return dateDiff;
        })
      );
    }
  };

  // fetched existing transactions
  const loadExistingTransactions = async () => {
    const response = await axios.post('/data-transactions', {
      month: moment().month() + 1,
      year: moment().year(),
    });

    setExistingTransactions(response.data);
  };

  useEffect(() => {
    // kicks off processing of raw CSV data once existing transactions have been fetched
    processTransactions(state.results);
  }, [existingTransactions]);

  useEffect(() => {
    // fetched categories
    axios
      .get('/data-categories')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => console.error(error));

    loadExistingTransactions();
  }, []);

  return (
    <Modal title="Categorize Transactions" onClose={() => navigate('/')}>
      <form onSubmit={(e) => e.preventDefault()}>
        {!shouldSplitTransactions && (
          <div className="transaction highlight">
            <h2>
              Last Import Date:{' '}
              {moment(state.lastImportDate).format('MM/DD/YYYY')}
            </h2>
          </div>
        )}

        {transactions.length > 0 &&
          categories.length > 0 &&
          transactions.map((row, index) => (
            <div className="transaction" key={row.transactionId}>
              <h3>
                {row.amount} &bull; {moment(row.date).format('MM/DD/YYYY')}
              </h3>
              <h6>{row.description}</h6>

              <p>
                <label htmlFor="">Category Name:</label>
                <CategorySelect
                  transaction={row}
                  onChange={addCategoryToTransaction}
                />
              </p>
              <p className="inline-input">
                <input
                  type="checkbox"
                  id={'hide-transaction-' + index}
                  onChange={(e) =>
                    setTransactions((prev) =>
                      prev.map((transaction, i) => {
                        return index === i
                          ? {
                              ...transaction,
                              isHidden: e.target.checked ? '1' : '0',
                            }
                          : transaction;
                      })
                    )
                  }
                />
                <label htmlFor={'hide-transaction-' + index}>
                  Hide Transaction
                </label>
              </p>
            </div>
          ))}

        <p>
          {transactions.filter(
            (transaction) =>
              transaction.categoryId && transaction.categoryId > 0
          ).length === transactions.length && (
            <button className="primary" onClick={finalizeTransactions}>
              Finish
            </button>
          )}
        </p>
      </form>
    </Modal>
  );
}

export default ProcessTransactions;
