import './App.css';

import Upload from './Upload';
import ProcessTransactions from './ProcessTransactions';
import Dashboard from './Dashboard';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DataContextProvider from './DataContextProvider';
import Banner from './Banner';

function App() {
  return (
    <div id="container">
      <DataContextProvider>
        <Banner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/process-transactions/:processParam"
              element={<ProcessTransactions />}
            />
            <Route
              path="/process-transactions/"
              element={<ProcessTransactions />}
            />
            <Route path="/upload" element={<Upload />} />
            <Route path="/view-category/:categoryId" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </DataContextProvider>
    </div>
  );
}
export default App;
