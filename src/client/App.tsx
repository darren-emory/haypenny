import { DataContextProvider } from './context/DataContext';
import Banner from './Banner';
import Dashboard from './Dashboard';
import Upload from './Upload';
import ProcessTransactions from './ProcessTransactions';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
