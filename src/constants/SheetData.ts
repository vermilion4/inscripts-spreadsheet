export interface SheetData {
  id: string;
  name: string;
  title: string;
  data: Array<{
    job: string;
    submitted: string;
    status: string;
    submitter: string;
    url: string;
    assigned: string;
    priority: string;
    due: string;
    value: string;
    [key: string]: string;
  }>;
  extraColumns?: { id: string; title: string }[];
}

// Dummy data for different sheets
const q3FinancialData = [
  {
    job: 'Launch social media campaign for product',
    submitted: '15-11-2024',
    status: 'In-process',
    submitter: 'Aisha Patel',
    url: 'www.aishapatel.com',
    assigned: 'Sophie Choudhury',
    priority: 'Medium',
    due: '20-11-2024',
    value: '6,200,000',
  },
  {
    job: 'Update press kit for company redesign',
    submitted: '28-10-2024',
    status: 'Need to start',
    submitter: 'Irfan Khan',
    url: 'www.irfankhan.com',
    assigned: 'Tejas Pandey',
    priority: 'High',
    due: '30-10-2024',
    value: '3,500,000',
  },
  {
    job: 'Finalize user testing feedback for app',
    submitted: '05-12-2024',
    status: 'In-process',
    submitter: 'Mark Johnson',
    url: 'www.markjohnson.com',
    assigned: 'Rachel Lee',
    priority: 'Medium',
    due: '10-12-2024',
    value: '4,750,000',
  },
  {
    job: 'Design new features for the website',
    submitted: '10-01-2025',
    status: 'Complete',
    submitter: 'Emily Green',
    url: 'www.emilygreen.com',
    assigned: 'Tom Wright',
    priority: 'Low',
    due: '15-01-2025',
    value: '5,900,000',
  },
  {
    job: 'Prepare financial report for Q4',
    submitted: '25-01-2025',
    status: 'Blocked',
    submitter: 'Jessica Brown',
    url: 'www.jessicabrown.com',
    assigned: 'Kevin Smith',
    priority: 'Low',
    due: '30-01-2025',
    value: '2,800,000',
  },
];

const pendingData = [
  {
    job: 'Review marketing campaign proposals',
    submitted: '12-11-2024',
    status: 'Need to start',
    submitter: 'Sarah Wilson',
    url: 'www.sarahwilson.com',
    assigned: 'David Chen',
    priority: 'High',
    due: '18-11-2024',
    value: '4,500,000',
  },
  {
    job: 'Update customer feedback system',
    submitted: '20-11-2024',
    status: 'In-process',
    submitter: 'Michael Brown',
    url: 'www.michaelbrown.com',
    assigned: 'Lisa Zhang',
    priority: 'Medium',
    due: '25-11-2024',
    value: '3,200,000',
  },
  {
    job: 'Implement new security protocols',
    submitted: '05-12-2024',
    status: 'Blocked',
    submitter: 'Alex Thompson',
    url: 'www.alexthompson.com',
    assigned: 'Ryan Miller',
    priority: 'High',
    due: '15-12-2024',
    value: '7,800,000',
  },
];

const reviewedData = [
  {
    job: 'Complete quarterly performance review',
    submitted: '01-11-2024',
    status: 'Complete',
    submitter: 'Jennifer Davis',
    url: 'www.jenniferdavis.com',
    assigned: 'Chris Anderson',
    priority: 'Medium',
    due: '10-11-2024',
    value: '5,600,000',
  },
  {
    job: 'Finalize product launch strategy',
    submitted: '15-11-2024',
    status: 'Complete',
    submitter: 'Robert Garcia',
    url: 'www.robertgarcia.com',
    assigned: 'Maria Rodriguez',
    priority: 'High',
    due: '20-11-2024',
    value: '8,900,000',
  },
  {
    job: 'Update company policies and procedures',
    submitted: '25-11-2024',
    status: 'Complete',
    submitter: 'Amanda White',
    url: 'www.amandawhite.com',
    assigned: 'James Taylor',
    priority: 'Low',
    due: '30-11-2024',
    value: '2,300,000',
  },
];

const arrivedData = [
  {
    job: 'Process new vendor applications',
    submitted: '10-12-2024',
    status: 'In-process',
    submitter: 'Daniel Lee',
    url: 'www.danielle.com',
    assigned: 'Sophia Kim',
    priority: 'Medium',
    due: '15-12-2024',
    value: '3,700,000',
  },
  {
    job: 'Review incoming partnership proposals',
    submitted: '18-12-2024',
    status: 'Need to start',
    submitter: 'Emma Wilson',
    url: 'www.emmawilson.com',
    assigned: 'Carlos Martinez',
    priority: 'High',
    due: '25-12-2024',
    value: '6,400,000',
  },
  {
    job: 'Analyze market research data',
    submitted: '22-12-2024',
    status: 'In-process',
    submitter: 'Nathan Clark',
    url: 'www.nathanclark.com',
    assigned: 'Olivia Johnson',
    priority: 'Medium',
    due: '30-12-2024',
    value: '4,100,000',
  },
];

// Helper function to create empty data rows
const createEmptyData = (count: number = 95) => {
  return Array.from({ length: count }, () => ({
    job: '',
    submitted: '',
    status: '',
    submitter: '',
    url: '',
    assigned: '',
    priority: '',
    due: '',
    value: '',
  }));
};

// Helper function to create sheet data with empty rows
const createSheetData = (
  id: string,
  name: string,
  title: string,
  data: Array<{
    job: string;
    submitted: string;
    status: string;
    submitter: string;
    url: string;
    assigned: string;
    priority: string;
    due: string;
    value: string;
  }>,
  emptyRows: number = 95,
  extraColumns: { id: string; title: string }[] = []
): SheetData => ({
  id,
  name,
  title,
  data: [...data, ...createEmptyData(emptyRows)],
  extraColumns,
});

export const sheetData: SheetData[] = [
  createSheetData(
    'all-orders',
    'All Orders',
    'Q3 Financial Overview',
    q3FinancialData
  ),
  createSheetData(
    'pending',
    'Pending',
    'Pending Review Dashboard',
    pendingData
  ),
  createSheetData(
    'reviewed',
    'Reviewed',
    'Completed Reviews Summary',
    reviewedData
  ),
  createSheetData('arrived', 'Arrived', 'New Arrivals Tracking', arrivedData),
];

// LocalStorage keys
const SHEETS_STORAGE_KEY = 'spreadsheet_sheets_data';
const ACTIVE_SHEET_KEY = 'spreadsheet_active_sheet';

// Save sheets to localStorage
export const saveSheetsToStorage = (sheets: SheetData[]) => {
  try {
    localStorage.setItem(SHEETS_STORAGE_KEY, JSON.stringify(sheets));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save sheets to localStorage:', error);
  }
};

// Load sheets from localStorage
export const loadSheetsFromStorage = (): SheetData[] => {
  try {
    const stored = localStorage.getItem(SHEETS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load sheets from localStorage:', error);
  }
  return sheetData;
};

// Save active sheet
export const saveActiveSheet = (sheetId: string) => {
  try {
    localStorage.setItem(ACTIVE_SHEET_KEY, sheetId);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save active sheet to localStorage:', error);
  }
};

// Load active sheet
export const loadActiveSheet = (): string => {
  try {
    return localStorage.getItem(ACTIVE_SHEET_KEY) || 'all-orders';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load active sheet from localStorage:', error);
    return 'all-orders';
  }
};

// Get sheet data by ID
export const getSheetDataById = (id: string): SheetData | undefined => {
  const sheets = loadSheetsFromStorage();
  return sheets.find(sheet => sheet.id === id);
};

// Create a new empty sheet
export const createNewSheet = (index: number): SheetData => {
  return {
    id: `sheet-${index}`,
    name: `Sheet ${index}`,
    title: `Sheet ${index} Overview`,
    data: createEmptyData(100),
    extraColumns: [],
  };
};
