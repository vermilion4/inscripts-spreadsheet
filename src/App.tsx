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

  const handleImportSheet = (importedSheet: SheetData) => {
    // Create a new sheet with the imported data
    const newSheetNumber = sheets.length + 1;
    const newSheet: SheetData = {
      ...importedSheet,
      id: `imported-${Date.now()}`,
      name: importedSheet.name,
      title: importedSheet.title
    };
    
    const newSheets = [...sheets, newSheet];
    setSheets(newSheets);
    saveSheetsToStorage(newSheets);
    
    // Set the new sheet as active
    setActiveSheet(newSheet);
    saveActiveSheet(newSheet.id);
  };

  const handleExportSheet = (sheetToExport: SheetData) => {
    // Create a JSON blob and download it
    const jsonData = JSON.stringify(sheetToExport, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sheetToExport.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen">
      <div className='sticky top-0 left-0 right-0 z-50'>
      <Header />
      <Toolbar 
        activeSheet={activeSheet}
        onImportSheet={handleImportSheet}
        onExportSheet={handleExportSheet}
      />
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
