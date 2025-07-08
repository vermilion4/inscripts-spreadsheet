import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Footer from './components/Footer';
import SpreadsheetTable from './components/SpreadsheetTable';
import {
  SheetData,
  DynamicHeader,
  loadSheetsFromStorage,
  saveSheetsToStorage,
  loadActiveSheet,
  saveActiveSheet,
} from './constants/SheetData';

// Helper function to convert sheet data to CSV format
const convertToCSV = (sheet: SheetData): string => {
  const headers = [
    'Row',
    'Job Request',
    'Submitted',
    'Status',
    'Submitter',
    'URL',
    'Assigned',
    'Priority',
    'Due Date',
    'Est. Value',
  ];

  // Add any extra column headers
  if (sheet.extraColumns) {
    headers.push(...sheet.extraColumns.map(col => col.title));
  }

  // Create CSV header row
  let csv = headers.join(',') + '\n';

  // Add data rows
  sheet.data.forEach((row, index) => {
    const rowData = [
      index + 1, // Row number
      row.job || '',
      row.submitted || '',
      row.status || '',
      row.submitter || '',
      row.url || '',
      row.assigned || '',
      row.priority || '',
      row.due || '',
      row.value || '',
      // Add any extra column values
      ...(sheet.extraColumns?.map(col => row[col.id] || '') || []),
    ];

    // Escape any commas in the data
    const escapedRow = rowData.map(cell => {
      const cellStr = String(cell);
      return cellStr.includes(',') ? `"${cellStr}"` : cellStr;
    });

    csv += escapedRow.join(',') + '\n';
  });

  return csv;
};

function App() {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState<SheetData | null>(null);
  // hiddenFields now stores row indices (numbers) to hide
  const [hiddenFields, setHiddenFields] = useState<Set<number>>(new Set());

  useEffect(() => {
    const storedSheets = loadSheetsFromStorage();
    setSheets(storedSheets);

    const activeSheetId = loadActiveSheet();
    const activeSheetData =
      storedSheets.find(sheet => sheet.id === activeSheetId) || storedSheets[0];
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

  const handleDataChange = (newData: SheetData['data']) => {
    if (!activeSheet) return;

    const updatedSheet = {
      ...activeSheet,
      data: newData,
    };

    setActiveSheet(updatedSheet);

    // Update sheets array and save to localStorage
    const updatedSheets = sheets.map(sheet =>
      sheet.id === activeSheet.id ? updatedSheet : sheet
    );
    setSheets(updatedSheets);
    saveSheetsToStorage(updatedSheets);
  };

  const handleExtraColumnsChange = (
    extraColumns: { id: string; title: string }[]
  ) => {
    if (!activeSheet) return;

    const updatedSheet = {
      ...activeSheet,
      extraColumns,
    };

    setActiveSheet(updatedSheet);

    // Update sheets array and save to localStorage
    const updatedSheets = sheets.map(sheet =>
      sheet.id === activeSheet.id ? updatedSheet : sheet
    );
    setSheets(updatedSheets);
    saveSheetsToStorage(updatedSheets);
  };

  const handleDynamicHeadersChange = (dynamicHeaders: DynamicHeader[]) => {
    if (!activeSheet) return;

    const updatedSheet = {
      ...activeSheet,
      dynamicHeaders,
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
    const newSheet: SheetData = {
      ...importedSheet,
      id: `imported-${Date.now()}`,
      name: importedSheet.name,
      title: importedSheet.title,
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

  const handleExportCSV = (sheetToExport: SheetData) => {
    // Create a CSV blob and download it
    const csvData = convertToCSV(sheetToExport);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${sheetToExport.name.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // hiddenFields now means hidden row indices
  const handleHiddenFieldsChange = (newHiddenFields: Set<number>) => {
    setHiddenFields(newHiddenFields);
  };

  return (
    <div className="h-screen bg-[#F6F6F6]">
      <div className="sticky top-0 left-0 right-0 z-50">
        <Header />
        <Toolbar
          activeSheet={activeSheet}
          onImportSheet={handleImportSheet}
          onExportSheet={handleExportSheet}
          onExportCSV={handleExportCSV}
          hiddenFields={hiddenFields}
          onHiddenFieldsChange={handleHiddenFieldsChange}
          onDynamicHeadersChange={handleDynamicHeadersChange}
        />
      </div>
      {activeSheet && (
        <SpreadsheetTable
          sheetData={activeSheet}
          onDataChange={handleDataChange}
          onExtraColumnsChange={handleExtraColumnsChange}
          hiddenFields={hiddenFields}
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
