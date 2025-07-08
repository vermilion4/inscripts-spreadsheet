// Helper function to create empty data rows
const createEmptyData = (count: number = 97) => {
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

export const importTemplates = [
  {
    id: 'template-1',
    name: 'Q3 Financial Data',
    title: 'Q3 Financial Overview',
    data: [
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
      ...createEmptyData(97), // Add 97 empty rows to make 100 total
    ],
    extraColumns: [],
    dynamicHeaders: [
      {
        id: 'abc-header',
        name: 'ABC',
        color: '#D2E0D4',
        columnSpans: [6], // URL column
      },
      {
        id: 'answer-header',
        name: 'Answer a question',
        color: '#DCCFFC',
        columnSpans: [7, 8], // Assigned and Priority columns
      },
      {
        id: 'extract-header',
        name: 'Extract',
        color: '#FAC2AF',
        columnSpans: [9], // Due Date column
      },
    ],
  },
  {
    id: 'template-2',
    name: 'Pending Reviews',
    title: 'Pending Review Dashboard',
    data: [
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
      ...createEmptyData(97), // Add 97 empty rows to make 100 total
    ],
    extraColumns: [],
    dynamicHeaders: [
      {
        id: 'review-header',
        name: 'Review',
        color: '#E3F2FD',
        columnSpans: [6, 7], // URL and Assigned columns
      },
      {
        id: 'approve-header',
        name: 'Approve',
        color: '#FFF8E1',
        columnSpans: [8, 9], // Priority and Due Date columns
      },
    ],
  },
  {
    id: 'template-3',
    name: 'Completed Projects',
    title: 'Completed Projects Summary',
    data: [
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
      ...createEmptyData(97), // Add 97 empty rows to make 100 total
    ],
    extraColumns: [],
    dynamicHeaders: [
      {
        id: 'archive-header',
        name: 'Archive',
        color: '#FCE4EC',
        columnSpans: [6], // URL column
      },
      {
        id: 'export-header',
        name: 'Export',
        color: '#E8F5E8',
        columnSpans: [7, 8, 9], // Assigned, Priority, and Due Date columns
      },
    ],
  },
];
