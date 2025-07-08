import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { IoLinkSharp } from "react-icons/io5";
import { GrPowerCycle } from "react-icons/gr";
import {ReactComponent as AssignedIcon} from '../assets/assigned.svg';
import {ReactComponent as SubmittedIcon} from '../assets/calendar.svg';
import {ReactComponent as StatusIcon} from '../assets/status.svg';
import {ReactComponent as SubmitterIcon} from '../assets/user.svg';
import {ReactComponent as URLIcon} from '../assets/globe.svg';
import {ReactComponent as JobIcon} from '../assets/job.svg';
import {ReactComponent as ActionIcon} from '../assets/action.svg'

import CaratDown from '../assets/carat-down.svg';
import Ellipsis from '../assets/ellipsis.svg'
import { FiPlus } from 'react-icons/fi';

const prefilledRows = [
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

const defaultData: Array<{
  job: string;
  submitted: string;
  status: string;
  submitter: string;
  url: string;
  assigned: string;
  priority: string;
  due: string;
  value: string;
  [key: string]: any; // allow extra columns
}> = [
  ...prefilledRows,
  ...Array.from({ length: 95 }, () => ({
    job: '',
    submitted: '',
    status: '',
    submitter: '',
    url: '',
    assigned: '',
    priority: '',
    due: '',
    value: '',
  })),
];

const statusColors: Record<string, string> = {
  'In-process': 'bg-[#FFF3D6] text-[#85640B]',
  'Need to start': 'bg-[#E2E8F0] text-[#475569]',
  'Complete': 'bg-[#D3F2E3] text-[#0A6E3D]',
  'Blocked': 'bg-[#FFE1DE] text-[#C22219]',
};

const priorityColors: Record<string, string> = {
  'High': 'text-[#EF4D44]',
  'Medium': 'text-[#C29210]',
  'Low': 'text-[#1A8CFF]',
};

// Helper to format value as lakh
function formatLakh(value: string) {
  if (!value) return '';
  const numericValue = value.replace(/[^\d.]/g, '');
  // Format with commas for thousands
  const formattedValue = Number(numericValue).toLocaleString('en-US');
  return (
    <>
      {formattedValue} <span className="text-disabledPrimary">₹</span>
    </>
  );
}

function EditableCell({
  value,
  rowIndex,
  columnId,
  onChange,
  isUrl,
  isStatus,
  isPriority,
  isSelected,
  onSelect,
  renderValue,
  align,
}: {
  value: string;
  rowIndex: number;
  columnId: string;
  onChange: (row: number, column: string, value: string) => void;
  isUrl?: boolean;
  isStatus?: boolean;
  isPriority?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  renderValue?: (value: string) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Auto-focus input when cell becomes selected
  useEffect(() => {
    if (isSelected && !editing) {
      displayRef.current?.focus();
      // For status and priority fields, start editing immediately when selected
      if (isStatus || isPriority) {
        setEditing(true);
      }
    }
  }, [isSelected, editing, isStatus, isPriority]);

  const handleCellClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditing(true);
    } else if (e.key === 'Escape') {
      setEditing(false);
      setInputValue(value || '');
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !isStatus && !isPriority) {
      // Start typing - replace content (only for non-dropdown fields)
      setInputValue(e.key);
      setEditing(true);
    } else if (e.key === 'F2') {
      setEditing(true);
    }
  };

  const finishEditing = () => {
    setEditing(false);
    onChange(rowIndex, columnId, inputValue);
  };

  // Auto-focus input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      // Only call select() on input elements, not select elements
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [editing]);

  if (editing) {
    if (isStatus) {
      return (
        <select
          ref={inputRef as any}
          className={`px-2 py-1 rounded-full text-xs font-medium mx-auto outline-none border border-borderTertiary w-[90%] flex ${statusColors[inputValue] || ''}`}
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value);
            onChange(rowIndex, columnId, e.target.value);
          }}
          onBlur={() => setEditing(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              setEditing(false);
            }
          }}
          onClick={e => e.stopPropagation()}
        >
          <option value="">Select</option>
          <option value="In-process">In-process</option>
          <option value="Need to start">Need to start</option>
          <option value="Complete">Complete</option>
          <option value="Blocked">Blocked</option>
        </select>
      );
    }

    if (isPriority) {
      return (
        <select
          ref={inputRef as any}
          className={`font-semibold w-[90%] border-0 outline-none bg-transparent mx-auto flex ${priorityColors[inputValue] || ''}`}
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value);
            onChange(rowIndex, columnId, e.target.value);
          }}
          onBlur={() => setEditing(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              setEditing(false);
            }
          }}
          onClick={e => e.stopPropagation()}
        >
          <option value="">Select</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      );
    }

    return (
      <input
        ref={inputRef}
        className={`w-full h-full px-2 py-0.5 border border-[#6C8B70] focus:outline-none bg-white shadow-[0px_0px_12px_0px_#0A6E3D38,0px_0px_4px_-2px_#0A6E3D99] ${align === 'right' ? 'text-right' : ''}`}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onBlur={finishEditing}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            finishEditing();
          } else if (e.key === 'Escape') {
            setEditing(false);
            setInputValue(value || '');
          }
        }}
        onClick={e => e.stopPropagation()}
      />
    );
  }

  // Display mode
  const cellContent = () => {
    if (isStatus && value) {
      return (
        <span className={`px-2 py-1 h-6 rounded-full text-xs font-medium flex items-center justify-center w-fit mx-auto ${statusColors[value] || ''}`}>
          {value}
        </span>
      );
    }

    if (isPriority && value) {
      return (
        <span className={`font-semibold flex justify-center ${priorityColors[value] || ''}`}>
          {value}
        </span>
      );
    }

    if (isUrl && value) {
      return (
        <a
          href={`https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline truncate max-w-[120px] block"
          onClick={e => e.stopPropagation()}
        >
          {value}
        </a>
      );
    }

    if (renderValue) {
      return renderValue(value);
    }

    return value || '\u00A0';
  };

  return (
    <div
      ref={displayRef}
      className={`w-full h-full flex items-center px-2 py-1 cursor-pointer ${isSelected ? 'border border-[#6C8B70] shadow-[0px_0px_12px_0px_#0A6E3D38,0px_0px_4px_-2px_#0A6E3D99] bg-white ' : 'hover:bg-[#E8F0E9]'} ${align === 'right' ? 'justify-end' : ''}`}
      onClick={handleCellClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <span className={`block w-full truncate ${align === 'right' ? 'text-right' : ''}`}>
        {cellContent()}
      </span>
    </div>
  );
}

export default function SpreadsheetTable() {
  const [data, setData] = useState(() => [...defaultData]);
  const [selectedCell, setSelectedCell] = useState<{row: number, column: string} | null>(null);
  const [extraColumns, setExtraColumns] = useState<{id: string, title: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevExtraColumnsLength = useRef(0);

  // Add column handler
  const handleAddColumn = () => {
    const nextIndex = extraColumns.length + 1;
    const newId = `extra_${nextIndex}`;
    setExtraColumns(cols => [...cols, { id: newId, title: `Title ${nextIndex + 5}` }]);
    setData(old => old.map(row => ({ ...row, [newId]: row[newId] || '' })));
  };

  // Scroll to right when a new column is added
  useEffect(() => {
    if (extraColumns.length > prevExtraColumnsLength.current) {
      // Scroll to the far right
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
      }
    }
    prevExtraColumnsLength.current = extraColumns.length;
  }, [extraColumns.length]);

  const handleCellChange = (row: number, column: string, value: string) => {
    setData(old => {
      const newData = [...old];
      newData[row] = { ...newData[row], [column]: value };
      return newData;
    });
  };

  const handleCellSelect = (row: number, column: string) => {
    setSelectedCell({row, column});
  };

  // Build columns array
  const baseColumns: ColumnDef<any, any>[] = [
    {
      id: 'row',
      header: '#',
      cell: info => info.row.index + 1,
      size: 32,
      enableSorting: false,
    },
    {
      accessorKey: 'job',
      header: () => (
        <div className="flex items-center justify-between gap-1">
          <span className="flex items-center gap-1">
            <JobIcon className="w-3 h-3" />
            Job Request
          </span>
          <img src={CaratDown} alt="carat-down" className="w-2.5 h-[5px]" />
        </div>
      ),
      cell: info => (
        <EditableCell
          value={info.getValue() || ''}
          rowIndex={info.row.index}
          columnId="job"
          onChange={handleCellChange}
          isSelected={selectedCell?.row === info.row.index && selectedCell?.column === 'job'}
          onSelect={() => handleCellSelect(info.row.index, 'job')}
        />
      ),
      size: 236,
    },
    {
      accessorKey: 'submitted',
      header: () => (
        <div className="flex items-center justify-between gap-1">
          <span className="flex items-center gap-1">
            <SubmittedIcon className="w-3 h-3" />
            Submitted
          </span>
          <img src={CaratDown} alt="carat-down" className="w-2.5 h-[5px]" />
        </div>
      ),
      cell: info => (
        <EditableCell
          value={info.getValue() || ''}
          rowIndex={info.row.index}
          columnId="submitted"
          onChange={handleCellChange}
          isSelected={selectedCell?.row === info.row.index && selectedCell?.column === 'submitted'}
          onSelect={() => handleCellSelect(info.row.index, 'submitted')}
          align="right"
        />
      ),
      size: 124,
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="flex items-center justify-between gap-1">
          <span className="flex items-center gap-1">
            <StatusIcon className="w-3 h-3" />
            Status
          </span>
          <img src={CaratDown} alt="carat-down" className="w-2.5 h-[5px]" />
        </div>
      ),
      cell: info => (
        <EditableCell
          value={info.getValue() || ''}
          rowIndex={info.row.index}
          columnId="status"
          onChange={handleCellChange}
          isStatus
          isSelected={selectedCell?.row === info.row.index && selectedCell?.column === 'status'}
          onSelect={() => handleCellSelect(info.row.index, 'status')}
        />
      ),
      size: 140,
    },
    {
      accessorKey: 'submitter',
      header: () => (
        <div className="flex items-center justify-between gap-1">
          <span className="flex items-center gap-1">
            <SubmitterIcon className="w-3 h-3" />
            Submitter
          </span>
          <img src={CaratDown} alt="carat-down" className="w-2.5 h-[5px]" />
        </div>
      ),
      cell: info => (
        <EditableCell
          value={info.getValue() || ''}
          rowIndex={info.row.index}
          columnId="submitter"
          onChange={handleCellChange}
          isSelected={selectedCell?.row === info.row.index && selectedCell?.column === 'submitter'}
          onSelect={() => handleCellSelect(info.row.index, 'submitter')}
        />
      ),
      size: 120,
    },
    {
      accessorKey: 'url',
      header: () => (
        <div className="flex items-center justify-between gap-1">
          <span className="flex items-center gap-1">
            <URLIcon className="w-3 h-3" />
            URL
          </span>
          <img src={CaratDown} alt="carat-down" className="w-2.5 h-[5px]" />
        </div>
      ),
      cell: info => (
        <EditableCell
          value={info.getValue() || ''}
          rowIndex={info.row.index}
          columnId="url"
          onChange={handleCellChange}
          isUrl
          isSelected={selectedCell?.row === info.row.index && selectedCell?.column === 'url'}
          onSelect={() => handleCellSelect(info.row.index, 'url')}
        />
      ),
      size: 180,
    },
    {
      accessorKey: 'assigned',
      header: () => (
        <span className="flex items-center gap-1">
          <AssignedIcon className="w-3 h-3" />
          Assigned
        </span>
      ),
      cell: info => (
        <EditableCell
          value={info.getValue() || ''}
          rowIndex={info.row.index}
          columnId="assigned"
          onChange={handleCellChange}
          isSelected={selectedCell?.row === info.row.index && selectedCell?.column === 'assigned'}
          onSelect={() => handleCellSelect(info.row.index, 'assigned')}
        />
      ),
      size: 120,
    },
    {
      accessorKey: 'priority',
      header: () => (
        <span className="flex items-center gap-1">
          Priority
        </span>
      ),
      cell: info => (
        <EditableCell
          value={info.getValue() || ''}
          rowIndex={info.row.index}
          columnId="priority"
          onChange={handleCellChange}
          isPriority
          isSelected={selectedCell?.row === info.row.index && selectedCell?.column === 'priority'}
          onSelect={() => handleCellSelect(info.row.index, 'priority')}
        />
      ),
      size: 100,
    },
    {
      accessorKey: 'due',
      header: () => (
        <span className="flex items-center gap-1">
          Due Date
        </span>
      ),
      cell: info => (
        <EditableCell
          value={info.getValue() || ''}
          rowIndex={info.row.index}
          columnId="due"
          onChange={handleCellChange}
          isSelected={selectedCell?.row === info.row.index && selectedCell?.column === 'due'}
          onSelect={() => handleCellSelect(info.row.index, 'due')}
          align="right"
        />
      ),
      size: 120,
    },
    {
      accessorKey: 'value',
      header: () => (
        <span className="flex items-center gap-1">
          Est. Value
        </span>
      ),
      cell: info => (
        <EditableCell
          value={info.getValue() || ''}
          rowIndex={info.row.index}
          columnId="value"
          onChange={handleCellChange}
          isSelected={selectedCell?.row === info.row.index && selectedCell?.column === 'value'}
          onSelect={() => handleCellSelect(info.row.index, 'value')}
          renderValue={formatLakh}
          align="right"
        />
      ),
      size: 160,
    },
  ];

  // Insert extra columns before the plus column
  const dynamicExtraColumns = extraColumns.map((col, idx) => ({
    id: col.id,
    header: () => col.title,
    cell: (info: any) => (
      <EditableCell
        value={info.row.original[col.id] || ''}
        rowIndex={info.row.index}
        columnId={col.id}
        onChange={handleCellChange}
        isSelected={selectedCell?.row === info.row.index && selectedCell?.column === col.id}
        onSelect={() => handleCellSelect(info.row.index, col.id)}
      />
    ),
    size: 124,
  }));

  // Plus column (always last)
  const plusColumn = {
    id: 'add-more',
    header: () => null,
    cell: () => null,
    size: 32,
    enableSorting: false,
  };

  // Final columns array: base columns + extra columns + plus column
  const columns = [
    ...baseColumns.slice(0, 10), // up to value column
    ...dynamicExtraColumns,
    plusColumn,
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto bg-white" ref={scrollRef}>
      <table className="w-full relative" style={{ borderCollapse: 'collapse', minWidth: '1200px' }}>
        <thead>
          {/* Custom top header row */}
          <tr>
            <th className="bg-white border-none p-0 sticky left-0 z-20" style={{ width: 32, minWidth: 32, maxWidth: 32 }}></th>
            <th colSpan={4} className="bg-borderSecondary text-[#3B3B3B] font-medium text-sm h-8 px-2 text-left border-none" style={{ minWidth: 236*4 }}>
              <div className="flex items-center gap-3 h-6">
                <span className="text-secondary-two text-xs bg-borderTertiary rounded-[4px] px-2 p-1 flex items-center gap-1 font-normal">
                  <IoLinkSharp size={16} color='#1A8CFF' />
                  Q3 Financial Overview</span>
                  <GrPowerCycle className='animate-spin' color='#FA6736' size={16} />
              </div>
            </th>
            <th className="bg-transparent border-none p-0" style={{ width: 180, minWidth: 180, maxWidth: 180 }}></th>
            <th className="bg-[#D2E0D4] text-[#505450] font-medium text-sm h-8 px-4 text-center border-none" style={{ minWidth: 120, maxWidth: 120 }}>
              <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                <ActionIcon className='w-3.5 h-3.5 custom-fill' />
                ABC
                <img src={Ellipsis} alt="ellipsis" />
                </span>
            </th>
            <th colSpan={2} className="bg-[#DCCFFC] text-textDark font-medium text-sm h-8 px-4 text-center border-none" style={{ minWidth: 220, maxWidth: 220 }}>
              <span className="flex items-center justify-center whitespace-nowrap gap-2">
                <ActionIcon className='w-3.5 h-3.5' />
                Answer a question
                <img src={Ellipsis} alt="ellipsis" />
                </span>
            </th>
            <th className="bg-[#FAC2AF] text-[#695149] font-medium text-sm h-8 px-4 text-center border-none" style={{ minWidth: 160, maxWidth: 160 }}>
              <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                <ActionIcon className='w-3.5 h-3.5' />
                Extract
                <img src={Ellipsis} alt="ellipsis" />
                </span>
            </th>
            {/* Render blank th for each extra column */}
            {extraColumns.map((col, idx) => (
              <th key={col.id} className=" p-0" style={{ width: 124, minWidth: 124, maxWidth: 124 }}></th>
            ))}
            {/* Plus column header with plus icon, sticky right */}
            <th className="bg-borderTertiary p-0 border-dotted-custom sticky right-0 z-20" style={{ width: 124, minWidth: 124, maxWidth: 124 }}>
              <button onClick={handleAddColumn} className="w-full h-full flex items-center justify-center focus:outline-none">
                <FiPlus size={20} color='#04071E' />
              </button>
            </th>
          </tr>
          {/* Existing column headers */}
          <tr>
            {table.getHeaderGroups().map(headerGroup =>
              headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  style={{
                    width: header.getSize(),
                    minWidth: header.getSize(),
                    maxWidth: header.getSize(),
                    borderTop: '1px solid #F6F6F6',
                    borderBottom: '1px solid #F6F6F6',
                  }}
                  className={`${index === 0 ? 'sticky left-0 z-10 bg-white' : ''} ${index === table.getAllColumns().length - 1 ? 'border-dotted-custom sticky right-0 z-10 bg-white ' : ''} h-8 text-xs border border-[#F6F6F6] ${
                    index === 0
                      ? 'text-center text-lg text-disabledPrimary italic font-normal after:absolute after:top-0 after:right-[-1px] after:bottom-0 after:w-[1px] after:bg-[#F6F6F6]'
                      : index === 6
                      ? 'text-left px-2 font-semibold !bg-[#E8F0E9] text-[#666C66]'
                      : (index === 7 || index === 8)
                      ? 'text-left px-2 font-semibold !bg-[#EAE3FC] text-[#655C80]'
                      : index === 9
                      ? 'text-left px-2 font-semibold !bg-[#FFE9E0] text-[#8C6C62]'
                      : 'text-left px-2 text-tertiary font-semibold'
                  }`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {table.getAllColumns().map((column, index) => (
                <td
                  key={column.id}
                  style={{
                    width: column.getSize(),
                    minWidth: column.getSize(),
                    maxWidth: column.getSize(),
                    backgroundColor: index === table.getAllColumns().length - 1 ? '#fff' : undefined,
                    borderTop: '1px solid #F6F6F6',
                    borderBottom: '1px solid #F6F6F6',
                  }}
                  className={`h-8 border border-[#F6F6F6] ${index === 0 ? 'sticky left-0 z-10 bg-white' : ''} ${index === table.getAllColumns().length - 1 ? 'border-dotted-custom sticky right-0 z-10 bg-white border' : ''} text-xs align-middle hover:bg-[#E8F0E9] focus-within:bg-[#E8F0E9] ${
                    index === 0 ? 'text-center text-tertiary after:absolute after:top-0 after:right-[-1px] after:bottom-0 after:w-[1px] after:bg-[#F6F6F6] after:border-b after:border-[#F6F6F6]' : 'text-left text-primary p-0'
                  }`}
                >
                  {flexRender(column.columnDef.cell, { ...row.getVisibleCells()[index]?.getContext?.() })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}