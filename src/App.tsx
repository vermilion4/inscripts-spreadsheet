import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Footer from './components/Footer';
import SpreadsheetTable from './components/SpreadsheetTable';
import { SheetData, loadSheetsFromStorage, saveSheetsToStorage, loadActiveSheet, saveActiveSheet } from './constants/SheetData';

function App() {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState<SheetData | null>(null);

  // Load sheets from localStorage on mount
  useEffect(() => {
    const storedSheets = loadSheetsFromStorage();
    setSheets(storedSheets);
    
    const activeSheetId = loadActiveSheet();
    const activeSheetData = storedSheets.find(sheet => sheet.id === activeSheetId) || storedSheets[0];
    setActiveSheet(activeSheetData);
  }, []);

  // Save active sheet when it changes
  useEffect(() => {
    if (activeSheet) {
      saveActiveSheet(activeSheet.id);
    }
  }, [activeSheet]);

  const handleSheetChange = (sheet: SheetData) => {
    setActiveSheet(sheet);
  };

  const handleSheetsChange = (newSheets: SheetData[]) => {
    setSheets(newSheets);
    saveSheetsToStorage(newSheets);
  };

  const handleDataChange = (newData: any[]) => {
    if (!activeSheet) return;
    
    const updatedSheet = {
      ...activeSheet,
      data: newData
    };
    
    setActiveSheet(updatedSheet);
    
    // Update sheets array and save to localStorage
    const updatedSheets = sheets.map(sheet => 
      sheet.id === activeSheet.id ? updatedSheet : sheet
    );
    setSheets(updatedSheets);
    saveSheetsToStorage(updatedSheets);
  };

  const handleExtraColumnsChange = (extraColumns: {id: string, title: string}[]) => {
    if (!activeSheet) return;
    
    const updatedSheet = {
      ...activeSheet,
      extraColumns
    };
    
    setActiveSheet(updatedSheet);
    
    // Update sheets array and save to localStorage
    const updatedSheets = sheets.map(sheet => 
      sheet.id === activeSheet.id ? updatedSheet : sheet
    );
    setSheets(updatedSheets);
    saveSheetsToStorage(updatedSheets);
  };

  return (
    <div className="h-screen">
      <div className='sticky top-0 left-0 right-0 z-50'>
      <Header />
      <Toolbar />
      </div>
      {activeSheet && (
        <SpreadsheetTable 
          sheetData={activeSheet} 
          onDataChange={handleDataChange} 
          onExtraColumnsChange={handleExtraColumnsChange}
        />
      )}
      <Footer 
        sheets={sheets} 
        activeSheetId={activeSheet?.id || ''} 
        onSheetChange={handleSheetChange}
        onSheetsChange={handleSheetsChange}
      />
    </div>
  );
}

export default App;
