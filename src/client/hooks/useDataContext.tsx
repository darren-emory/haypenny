// src/hooks/useDataContext.ts
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used inside a DataContextProvider');
  }
  return context;
}

export default useDataContext;
