import React from 'react';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Footer from './components/Footer';
import SpreadsheetTable from './components/SpreadsheetTable';

function App() {

  return (
    <div className="h-screen">
      <div className='sticky top-0 left-0 right-0 z-50'>
      <Header />
      <Toolbar />
      </div>
      <SpreadsheetTable />
      <Footer />
    </div>
  );
}

export default App;
