import { useState } from 'react';
import { ITransaction } from './utils/interfaces';
import EditTransactionModal from './components/EditTransactionModal';
import SplitTransactionModal from './components/SplitTransactionModal';
import moment from 'moment';
import { decode, encode } from 'he';
import Gear from '../icons/Gear';
import Duplicate from '../icons/Duplicate';
import Modal from './components/Modal';

type Props = {
  transaction: ITransaction;
  setSortedTransactions: (transactions: ITransaction[]) => void;
};

function Transaction({ transaction, setSortedTransactions }: Props) {
  const [editTransactionModalOpen, setEditTransactionModalOpen] =
    useState(false);
  const [splitTransactionModalOpen, setSplitTransactionModalOpen] =
    useState(false);

  return (
    <>
      {editTransactionModalOpen && (
        <Modal onClose={setEditTransactionModalOpen} title="Edit Transaction">
          <EditTransactionModal
            transaction={transaction}
            setSortedTransactions={setSortedTransactions}
          />
        </Modal>
      )}
      {splitTransactionModalOpen && (
        <Modal onClose={setSplitTransactionModalOpen} title="Split Transaction">
          <SplitTransactionModal
            originalTransaction={transaction}
            setSortedTransactions={setSortedTransactions}
          />
        </Modal>
      )}
      <div
        key={transaction.transactionId}
        className={
          transaction.isHidden === '1' ? 'transaction hidden' : 'transaction'
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="transaction-title">
          <h6>{decode(transaction.description)}</h6>
          <h6>
            {moment(transaction.date).format('MM/DD/YYYY')}
            {transaction.note !== '' ? ' - ' + transaction.note : <></>}
          </h6>
        </div>
        <div className="transaction-amount">
          <h5>{transaction.amount}</h5>
          <button
            className="mini-icon"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setEditTransactionModalOpen(true);
            }}
          >
            <Gear />
          </button>
          <button
            className="mini-icon"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setSplitTransactionModalOpen(true);
            }}
          >
            <Duplicate />
          </button>
        </div>
      </div>
    </>
  );
}

export default Transaction;
