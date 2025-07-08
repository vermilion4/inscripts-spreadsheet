import React, { useState, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  Row,
} from '@tanstack/react-table';
import { IoLinkSharp } from 'react-icons/io5';
import { GrPowerCycle } from 'react-icons/gr';
import { ReactComponent as AssignedIcon } from '../assets/assigned.svg';
import { ReactComponent as SubmittedIcon } from '../assets/calendar.svg';
import { ReactComponent as StatusIcon } from '../assets/status.svg';
import { ReactComponent as SubmitterIcon } from '../assets/user.svg';
import { ReactComponent as URLIcon } from '../assets/globe.svg';
import { ReactComponent as JobIcon } from '../assets/job.svg';
import { ReactComponent as ActionIcon } from '../assets/action.svg';

import CaratDown from '../assets/carat-down.svg';
import Pound from '../assets/pound.svg';
import Ellipsis from '../assets/ellipsis.svg';
import {
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiCopy,
  FiDownload,
  FiUpload,
} from 'react-icons/fi';
import { SheetData } from '../constants/SheetData';
import Dropdown from '../ui/Dropdown';

interface SpreadsheetTableProps {
  sheetData?: SheetData;
  onDataChange?: (data: RowData[]) => void;
  onExtraColumnsChange?: (
    extraColumns: { id: string; title: string }[]
  ) => void;
  hiddenFields?: Set<number>;
}

interface RowData {
  job: string;
  submitted: string;
  status: string;
  submitter: string;
  url: string;
  assigned: string;
  priority: string;
  due: string;
  value: string;
  [key: string]: string; // allow extra columns
}

// Default empty data structure for new sheets
const defaultData: RowData[] = Array.from({ length: 100 }, () => ({
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

const statusColors: Record<string, string> = {
  'In-process': 'bg-[#FFF3D6] text-[#85640B]',
  'Need to start': 'bg-[#E2E8F0] text-[#475569]',
  Complete: 'bg-[#D3F2E3] text-[#0A6E3D]',
  Blocked: 'bg-[#FFE1DE] text-[#C22219]',
};

const priorityColors: Record<string, string> = {
  High: 'text-[#EF4D44]',
  Medium: 'text-[#C29210]',
  Low: 'text-[#1A8CFF]',
};

// Common dropdown items for all sections
const createDropdownItems = (prefix: string) => [
  {
    id: `${prefix}-edit`,
    label: 'Edit',
    icon: <FiEdit3 size={16} />,
    onClick: () => alert('Edit clicked'),
  },
  {
    id: `${prefix}-copy`,
    label: 'Copy',
    icon: <FiCopy size={16} />,
    onClick: () => alert('Copy clicked'),
  },
  {
    id: `${prefix}-download`,
    label: 'Download',
    icon: <FiDownload size={16} />,
    onClick: () => alert('Download clicked'),
  },
  {
    id: `${prefix}-upload`,
    label: 'Upload',
    icon: <FiUpload size={16} />,
    onClick: () => alert('Upload clicked'),
  },
  {
    id: `${prefix}-delete`,
    label: 'Delete',
    icon: <FiTrash2 size={16} />,
    onClick: () => alert('Delete clicked'),
  },
];

// Helper to format value as lakh
function formatLakh(value: string) {
  if (!value) return '';
  const numericValue = value.replace(/[^\d.]/g, '');
  // Format with commas for thousands
  const formattedValue = Number(numericValue).toLocaleString('en-US');
  return (
    <>
      {formattedValue} <span className="text-disabledPrimary ml-1">₹</span>
    </>
  );
}

interface EditableCellProps {
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
}: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
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
    } else if (
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !isStatus &&
      !isPriority
    ) {
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
    if (editing) {
      if (isStatus || isPriority) {
        if (selectRef.current) {
          selectRef.current.focus();
        }
      } else if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [editing, isStatus, isPriority]);

  if (editing) {
    if (isStatus) {
      return (
        <select
          ref={selectRef}
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
          ref={selectRef}
          className={`px-2 py-1 font-semibold w-[90%] border-0 outline-none bg-transparent mx-auto flex ${priorityColors[inputValue] || ''}`}
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
        className={`w-full h-full px-2 py-1 border border-[#6C8B70] focus:outline-none bg-white shadow-[0px_0px_12px_0px_#0A6E3D38,0px_0px_4px_-2px_#0A6E3D99] ${align === 'right' ? 'text-right' : ''}`}
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
        <span
          className={`px-2 py-1 h-6 rounded-full text-xs font-medium flex items-center justify-center w-fit mx-auto ${statusColors[value] || ''}`}
        >
          {value}
        </span>
      );
    }

    if (isPriority && value) {
      return (
        <span
          className={`font-semibold flex mx-auto justify-center ${priorityColors[value] || ''}`}
        >
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
      className={`w-full h-full min-h-[2rem] flex items-center cursor-pointer ${isSelected ? 'border border-[#6C8B70] shadow-[0px_0px_12px_0px_#0A6E3D38,0px_0A6E3D99] bg-white ' : 'hover:bg-[#E8F0E9]'} ${align === 'right' ? 'justify-end' : ''}`}
      onClick={handleCellClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <span
        className={`w-full truncate h-full flex items-center px-2 py-1 ${align === 'right' ? 'justify-end' : ''}`}
      >
        {cellContent()}
      </span>
    </div>
  );
}

// Helper function to create column header with icon and dropdown
const createColumnHeader = (
  icon: React.ReactNode,
  title: string,
  onColumnSelect: (columnId: string) => void,
  columnId: string
) => (
  <div
    className="flex items-center justify-between gap-1 cursor-pointer px-1 py-1 rounded"
    onClick={() => onColumnSelect(columnId)}
  >
    <span className="flex items-center gap-1">
      {icon}
      {title}
    </span>
    <img src={CaratDown} alt="carat-down" className="w-2.5 h-[5px]" />
  </div>
);

// Helper function to create simple column header
const createSimpleHeader = (title: string, icon?: React.ReactNode) => (
  <div className="flex items-center gap-1">
    {icon}
    {title}
  </div>
);

// Helper function to create EditableCell with common props
const createEditableCell = (
  info: { getValue: () => string | undefined; row: { index: number } },
  columnId: string,
  handleCellChange: (row: number, column: string, value: string) => void,
  handleCellSelect: (row: number, column: string) => void,
  selectedCell: { row: number; column: string } | null,
  options: {
    isUrl?: boolean;
    isStatus?: boolean;
    isPriority?: boolean;
    renderValue?: (value: string) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
  } = {}
) => (
  <EditableCell
    value={(info.getValue() as string) || ''}
    rowIndex={info.row.index}
    columnId={columnId}
    onChange={handleCellChange}
    isSelected={
      selectedCell?.row === info.row.index && selectedCell?.column === columnId
    }
    onSelect={() => handleCellSelect(info.row.index, columnId)}
    {...options}
  />
);

export default function SpreadsheetTable({
  sheetData,
  onDataChange,
  onExtraColumnsChange,
  hiddenFields,
}: SpreadsheetTableProps) {
  const [data, setData] = useState<RowData[]>(
    () => sheetData?.data || [...defaultData]
  );
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    column: string;
  } | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [extraColumns, setExtraColumns] = useState<
    { id: string; title: string }[]
  >(sheetData?.extraColumns || []);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevExtraColumnsLength = useRef(0);

  // Update data and extra columns when sheetData changes
  useEffect(() => {
    if (sheetData?.data) {
      setData([...sheetData.data]);
    }
    if (sheetData?.extraColumns) {
      setExtraColumns([...sheetData.extraColumns]);
    } else {
      setExtraColumns([]);
    }
  }, [sheetData]);

  // Handle copying sheet title
  const handleCopyTitle = async () => {
    const title = sheetData?.title || 'Q3 Financial Overview';
    try {
      await navigator.clipboard.writeText(title);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } catch (err) {
      console.error('Failed to copy title:', err);
    }
  };

  // Add column handler
  const handleAddColumn = () => {
    const nextIndex = extraColumns.length + 1;
    const newId = `extra_${nextIndex}`;
    const newExtraColumns = [
      ...extraColumns,
      { id: newId, title: `Title ${nextIndex + 5}` },
    ];
    setExtraColumns(newExtraColumns);

    // Update data with the new column, ensuring all rows have the new field
    setData(old => old.map(row => ({ ...row, [newId]: '' })));

    // Notify parent component about extra columns change
    if (onExtraColumnsChange) {
      onExtraColumnsChange(newExtraColumns);
    }
  };

  // Scroll to right when a new column is added
  useEffect(() => {
    if (extraColumns.length > prevExtraColumnsLength.current) {
      // Scroll to the far right
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          left: scrollRef.current.scrollWidth,
          behavior: 'smooth',
        });
      }
    }
    prevExtraColumnsLength.current = extraColumns.length;
  }, [extraColumns.length]);

  const handleCellChange = (row: number, column: string, value: string) => {
    setData(old => {
      const newData = [...old];
      newData[row] = { ...newData[row], [column]: value };
      // Notify parent component about data changes
      if (onDataChange) {
        onDataChange(newData);
      }
      return newData;
    });
  };

  const handleCellSelect = (row: number, column: string) => {
    setSelectedCell({ row, column });
  };

  const handleColumnSelect = (columnId: string) => {
    setSelectedColumn(selectedColumn === columnId ? null : columnId);
  };

  // Build columns array
  const baseColumns: ColumnDef<RowData>[] = [
    {
      id: 'row',
      header: () => (
        <div className="flex items-center justify-center">
          <img src={Pound} alt="pound" className="w-3 h-3" />
        </div>
      ),
      cell: info => info.row.index + 1,
      size: 32,
      enableSorting: false,
    },
    {
      accessorKey: 'job',
      header: () =>
        createColumnHeader(
          <JobIcon className="w-3 h-3" />,
          'Job Request',
          handleColumnSelect,
          'job'
        ),
      cell: info =>
        createEditableCell(
          {
            getValue: () => info.getValue() as string,
            row: { index: info.row.index },
          },
          'job',
          handleCellChange,
          handleCellSelect,
          selectedCell
        ),
      size: 240,
    },
    {
      accessorKey: 'submitted',
      header: () =>
        createColumnHeader(
          <SubmittedIcon className="w-3 h-3" />,
          'Submitted',
          handleColumnSelect,
          'submitted'
        ),
      cell: info =>
        createEditableCell(
          {
            getValue: () => info.getValue() as string,
            row: { index: info.row.index },
          },
          'submitted',
          handleCellChange,
          handleCellSelect,
          selectedCell,
          { align: 'right' }
        ),
      size: 120,
    },
    {
      accessorKey: 'status',
      header: () =>
        createColumnHeader(
          <StatusIcon className="w-3 h-3" />,
          'Status',
          handleColumnSelect,
          'status'
        ),
      cell: info =>
        createEditableCell(
          {
            getValue: () => info.getValue() as string,
            row: { index: info.row.index },
          },
          'status',
          handleCellChange,
          handleCellSelect,
          selectedCell,
          { isStatus: true }
        ),
      size: 120,
    },
    {
      accessorKey: 'submitter',
      header: () =>
        createColumnHeader(
          <SubmitterIcon className="w-3 h-3" />,
          'Submitter',
          handleColumnSelect,
          'submitter'
        ),
      cell: info =>
        createEditableCell(
          {
            getValue: () => info.getValue() as string,
            row: { index: info.row.index },
          },
          'submitter',
          handleCellChange,
          handleCellSelect,
          selectedCell
        ),
      size: 120,
    },
    {
      accessorKey: 'url',
      header: () =>
        createColumnHeader(
          <URLIcon className="w-3 h-3" />,
          'URL',
          handleColumnSelect,
          'url'
        ),
      cell: info =>
        createEditableCell(
          {
            getValue: () => info.getValue() as string,
            row: { index: info.row.index },
          },
          'url',
          handleCellChange,
          handleCellSelect,
          selectedCell,
          { isUrl: true }
        ),
      size: 120,
    },
    {
      accessorKey: 'assigned',
      header: () =>
        createSimpleHeader('Assigned', <AssignedIcon className="w-3 h-3" />),
      cell: info =>
        createEditableCell(
          {
            getValue: () => info.getValue() as string,
            row: { index: info.row.index },
          },
          'assigned',
          handleCellChange,
          handleCellSelect,
          selectedCell
        ),
      size: 120,
    },
    {
      accessorKey: 'priority',
      header: () => createSimpleHeader('Priority'),
      cell: info =>
        createEditableCell(
          {
            getValue: () => info.getValue() as string,
            row: { index: info.row.index },
          },
          'priority',
          handleCellChange,
          handleCellSelect,
          selectedCell,
          { isPriority: true }
        ),
      size: 100,
    },
    {
      accessorKey: 'due',
      header: () => createSimpleHeader('Due Date'),
      cell: info =>
        createEditableCell(
          {
            getValue: () => info.getValue() as string,
            row: { index: info.row.index },
          },
          'due',
          handleCellChange,
          handleCellSelect,
          selectedCell,
          { align: 'right' }
        ),
      size: 120,
    },
    {
      accessorKey: 'value',
      header: () => createSimpleHeader('Est. Value'),
      cell: info =>
        createEditableCell(
          {
            getValue: () => info.getValue() as string,
            row: { index: info.row.index },
          },
          'value',
          handleCellChange,
          handleCellSelect,
          selectedCell,
          { renderValue: formatLakh, align: 'right' }
        ),
      size: 160,
    },
  ];

  // Insert extra columns before the plus column
  const dynamicExtraColumns: ColumnDef<RowData>[] = extraColumns.map(col => ({
    id: col.id,
    header: () => createSimpleHeader(col.title),
    cell: (info: { row: Row<RowData> }) => (
      <EditableCell
        value={info.row.original[col.id] || ''}
        rowIndex={info.row.index}
        columnId={col.id}
        onChange={handleCellChange}
        isSelected={
          selectedCell?.row === info.row.index &&
          selectedCell?.column === col.id
        }
        onSelect={() => handleCellSelect(info.row.index, col.id)}
      />
    ),
    size: 124,
  }));

  // Plus column (always last)
  const plusColumn: ColumnDef<RowData> = {
    id: 'add-more',
    header: () => null,
    cell: () => null,
    size: 100,
    enableSorting: false,
  };

  // Final columns array: base columns + extra columns + plus column
  const columns = [...baseColumns, ...dynamicExtraColumns, plusColumn];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Filter out hidden rows (1-based index)
  const visibleRows = table
    .getRowModel()
    .rows.filter((row, idx) => !hiddenFields?.has(idx + 1));

  return (
    <div
      className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mr-4 bg-white"
      ref={scrollRef}
    >
      <table className="w-full relative" style={{ borderCollapse: 'collapse' }}>
        <thead>
          {/* Custom top header row */}
          <tr>
            <th
              className="bg-white border-none p-0 sticky left-0 z-20"
              style={{ width: 32, minWidth: 32, maxWidth: 32 }}
            ></th>
            <th
              colSpan={4}
              className="bg-borderSecondary text-[#3B3B3B] font-medium text-sm h-8 px-2 text-left border-none"
            >
              <div className="flex items-center gap-3 h-6">
                <button
                  onClick={handleCopyTitle}
                  className={`text-secondary-two text-xs bg-borderTertiary rounded-[4px] px-2 p-1 flex items-center gap-1 font-normal transition-colors hover:bg-gray-200 cursor-pointer ${
                    copiedTitle ? 'bg-green-100 text-green-700' : ''
                  }`}
                  title={copiedTitle ? 'Copied!' : 'Click to copy sheet title'}
                >
                  <IoLinkSharp
                    size={16}
                    color={copiedTitle ? '#059669' : '#1A8CFF'}
                  />
                  {sheetData?.title || 'Q3 Financial Overview'}
                  {copiedTitle && <span className="ml-1 text-xs">✓</span>}
                </button>
                <GrPowerCycle
                  className="animate-spin"
                  color="#FA6736"
                  size={16}
                />
              </div>
            </th>
            <th
              className="bg-transparent border-none p-0"
              style={{ width: 180, minWidth: 180, maxWidth: 180 }}
            ></th>
            <th
              className="bg-[#D2E0D4] text-[#505450] font-medium text-sm h-8 px-4 text-center border-none"
              style={{ minWidth: 120, maxWidth: 120 }}
            >
              <Dropdown
                trigger={
                  <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                    <ActionIcon className="w-3.5 h-3.5 custom-fill" />
                    ABC
                    <img src={Ellipsis} alt="ellipsis" />
                  </span>
                }
                items={createDropdownItems('abc')}
                width="100px"
              />
            </th>
            <th
              colSpan={2}
              className="bg-[#DCCFFC] text-textDark font-medium text-sm h-8 px-4 text-center border-none"
              style={{ minWidth: 220, maxWidth: 220 }}
            >
              <Dropdown
                trigger={
                  <span className="flex items-center justify-center whitespace-nowrap gap-2">
                    <ActionIcon className="w-3.5 h-3.5" />
                    Answer a question
                    <img src={Ellipsis} alt="ellipsis" />
                  </span>
                }
                items={createDropdownItems('answer')}
                width="100px"
              />
            </th>
            <th
              className="bg-[#FAC2AF] text-[#695149] font-medium text-sm h-8 px-4 text-center border-none"
              style={{ minWidth: 160, maxWidth: 160 }}
            >
              <Dropdown
                trigger={
                  <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                    <ActionIcon className="w-3.5 h-3.5" />
                    Extract
                    <img src={Ellipsis} alt="ellipsis" />
                  </span>
                }
                items={createDropdownItems('extract')}
                width="100px"
              />
            </th>
            {/* Render blank th for each extra column */}
            {extraColumns.map(col => (
              <th
                key={col.id}
                className=" p-0"
                style={{ width: 124, minWidth: 124, maxWidth: 124 }}
              ></th>
            ))}
            {/* Plus column header with plus icon, sticky right */}
            <th
              className="bg-borderTertiary p-0 border-dotted-custom sticky right-0 z-20"
              style={{ width: 100, minWidth: 100, maxWidth: 100 }}
            >
              <button
                onClick={handleAddColumn}
                className="w-full h-full flex items-center justify-center focus:outline-none"
              >
                <FiPlus size={20} color="#04071E" />
              </button>
            </th>
          </tr>
          {/* Existing column headers */}
          <tr>
            {table.getHeaderGroups().map(headerGroup =>
              headerGroup.headers.map((header, index) => {
                const columnId = header.column.id;
                const isSelected = selectedColumn === columnId;

                return (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      minWidth: header.getSize(),
                      maxWidth: header.getSize(),
                      borderTop: '1px solid #F6F6F6',
                      borderBottom: '1px solid #F6F6F6',
                    }}
                    className={`${index === 0 ? 'sticky left-0 z-10' : ''} ${index === table.getAllColumns().length - 1 ? 'border-dotted-custom sticky right-0 z-10 bg-white ' : ''} h-8 text-xs border border-[#F6F6F6] bg-borderTertiary ${
                      index === 0
                        ? 'after:absolute after:top-0 after:right-[-1px] after:bottom-0 after:w-[1px] after:bg-[#F6F6F6]'
                        : index === 6
                          ? 'text-left px-2 font-semibold !bg-[#E8F0E9] text-[#666C66]'
                          : index === 7 || index === 8
                            ? 'text-left px-2 font-semibold !bg-[#EAE3FC] text-[#655C80]'
                            : index === 9
                              ? 'text-left px-2 font-semibold !bg-[#FFE9E0] text-[#8C6C62]'
                              : 'text-left px-2 text-tertiary font-semibold'
                    } ${isSelected ? 'bg-[#D2E0D4]' : ''}`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                );
              })
            )}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, index) => {
                const columnId = cell.column.id;
                const isSelected = selectedColumn === columnId;

                return (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                      minWidth: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                      backgroundColor:
                        index === row.getVisibleCells().length - 1
                          ? '#fff'
                          : isSelected
                            ? '#D2E0D4'
                            : undefined,
                      borderTop: '1px solid #F6F6F6',
                      borderBottom: '1px solid #F6F6F6',
                    }}
                    className={`h-8 border border-[#F6F6F6] ${index === 0 ? 'sticky left-0 z-10 bg-white' : ''} ${index === row.getVisibleCells().length - 1 ? 'border-dotted-custom sticky right-0 z-10 bg-white border' : ''} text-xs align-middle hover:bg-[#E8F0E9] focus-within:bg-[#E8F0E9] ${
                      index === 0
                        ? 'text-center text-tertiary after:absolute after:top-0 after:right-[-1px] after:bottom-0 after:w-[1px] after:bg-[#F6F6F6] after:border-b after:border-[#F6F6F6]'
                        : 'text-left text-primary p-0'
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
