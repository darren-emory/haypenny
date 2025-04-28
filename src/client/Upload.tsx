import { useState, CSSProperties, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCSVReader } from 'react-papaparse';
import axios from 'axios';
import moment from 'moment';
import Modal from './components/Modal';

function Upload() {
  const [importedData, setImportedData] = useState('');
  const [lastImportDate, setLastImportDate] = useState('');
  const { CSVReader } = useCSVReader();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/data-last-import')
      .then((res) => setLastImportDate(res.data[0][0].lastImportDate))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Modal title="Upload File" onClose={() => navigate('/')}>
        <form onSubmit={(e) => e.preventDefault()}>
          <CSVReader
            onUploadAccepted={(results: any) => {
              let trimmedResults = results.data.slice(1, 300);

              // filters out all transactions except for the current month
              trimmedResults = trimmedResults.filter(
                (transaction: any) =>
                  moment(transaction[1]).month() == moment().month()
              );

              // filters out all transactions that aren't before or the same as last import date
              trimmedResults = trimmedResults.filter(
                (transaction: any) =>
                  moment(lastImportDate).isBefore(transaction[1]) ||
                  moment(lastImportDate).isSame(transaction[1])
              );

              let importData = {
                results: trimmedResults,
                lastImportDate: lastImportDate,
              };

              navigate('/process-transactions', { state: importData });
            }}
          >
            {({ getRootProps }: any) => (
              <>
                <p>
                  <button className="primary" type="button" {...getRootProps()}>
                    Browse
                  </button>
                </p>
              </>
            )}
          </CSVReader>
        </form>
      </Modal>
    </>
  );
}

export default Upload;
