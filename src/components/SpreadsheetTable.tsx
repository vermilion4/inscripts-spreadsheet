import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import {ReactComponent as AssignedIcon} from '../assets/assigned.svg';
import {ReactComponent as SubmittedIcon} from '../assets/calendar.svg';
import {ReactComponent as StatusIcon} from '../assets/status.svg';
import {ReactComponent as SubmitterIcon} from '../assets/user.svg';
import {ReactComponent as URLIcon} from '../assets/globe.svg';
import {ReactComponent as JobIcon} from '../assets/job.svg';

import CaratDown from '../assets/carat-down.svg';

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

const defaultData = [
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
          className={`px-2 py-1 rounded-full text-xs font-medium w-full border-0 outline-none ${statusColors[inputValue] || ''}`}
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
          className={`font-semibold w-full border-0 outline-none bg-transparent ${priorityColors[inputValue] || ''}`}
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
        className="w-full h-full px-2 py-0.5 border border-[#6C8B70] focus:outline-none bg-white shadow-[0px_0px_12px_0px_#0A6E3D38,0px_0px_4px_-2px_#0A6E3D99]"
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

    return value || '\u00A0';
  };

  return (
    <div
      ref={displayRef}
      className={`w-full h-full flex items-center px-2 py-1 cursor-pointer  ${isSelected ? 'border border-[#6C8B70] shadow-[0px_0px_12px_0px_#0A6E3D38,0px_0px_4px_-2px_#0A6E3D99] bg-white ' : 'hover:bg-[#E8F0E9]'}`}
      onClick={handleCellClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <span className="block w-full truncate">
        {cellContent()}
      </span>
    </div>
  );
}

export default function SpreadsheetTable() {
  const [data, setData] = useState(() => [...defaultData]);
  const [selectedCell, setSelectedCell] = useState<{row: number, column: string} | null>(null);

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

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
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
          />
        ),
        size: 144,
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
        size: 150,
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
        size: 150,
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
          />
        ),
        size: 120,
      },
    ],
    [selectedCell]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full relative" style={{ borderCollapse: 'collapse', minWidth: '1200px' }}>
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className={`h-8 text-xs border border-[#F6F6F6] bg-borderTertiary ${
                    index === 0
                      ? 'text-center text-lg text-disabledPrimary italic font-normal sticky left-0 z-10 after:absolute after:top-0 after:right-[-1px] after:bottom-0 after:w-[1px] after:bg-[#F6F6F6]'
                      : index === 6
                      ? 'text-left px-2 font-semibold bg-[#E8F0E9] text-[#666C66]'
                      : (index === 7 || index === 8)
                      ? 'text-left px-2 font-semibold bg-[#EAE3FC] text-[#655C80]'
                      : index === 9
                      ? 'text-left px-2 font-semibold bg-[#FFE9E0] text-[#8C6C62]'
                      : 'text-left px-2 text-tertiary font-semibold'
                  }`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, index) => (
                <td
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                  className={`h-8 border border-[#F6F6F6] text-xs align-middle bg-white hover:bg-blue-50 focus-within:bg-blue-50 ${
                    index === 0 ? 'text-center text-tertiary sticky left-0 z-10 after:absolute after:top-0 after:right-[-1px] after:bottom-0 after:w-[1px] after:bg-[#F6F6F6] after:border-b after:border-[#F6F6F6] px-1' : 'text-left text-primary p-0'
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}