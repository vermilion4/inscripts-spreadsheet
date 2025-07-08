import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { DynamicHeader, headerColorOptions } from '../constants/SheetData';

interface NewActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHeader: (header: DynamicHeader) => void;
  availableColumns: { id: string; name: string; index: number }[];
  existingHeaders: DynamicHeader[];
}

const NewActionModal: React.FC<NewActionModalProps> = ({
  isOpen,
  onClose,
  onAddHeader,
  availableColumns,
  existingHeaders,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(headerColorOptions[0]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelectedColor(headerColorOptions[0]);
      setSelectedColumns([]);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || selectedColumns.length === 0) {
      return;
    }

    const newHeader: DynamicHeader = {
      id: `header-${Date.now()}`,
      name: name.trim(),
      color: selectedColor.value,
      columnSpans: selectedColumns,
    };

    onAddHeader(newHeader);
    onClose();
  };

  const handleColumnToggle = (columnId: string) => {
    const sorted = [...selectedColumns];
    const idx = sorted.indexOf(columnId);
    if (idx !== -1) {
      // Deselect: remove this column and all columns to its right
      setSelectedColumns(sorted.slice(0, idx));
    } else {
      if (selectedColumns.length === 0) {
        setSelectedColumns([columnId]);
      } else {
        // Only allow if contiguous to the right
        const selectedIndices = selectedColumns
          .map(id => availableColumns.findIndex(col => col.id === id))
          .sort((a, b) => a - b);
        const maxIdx = Math.max(...selectedIndices);
        const thisIdx = availableColumns.findIndex(col => col.id === columnId);
        if (thisIdx === maxIdx + 1) {
          setSelectedColumns([...sorted, columnId]);
        }
      }
    }
  };

  // Define which columns are NOT available for dynamic headers
  // Based on your layout:
  // - Row column should be excluded
  // - Columns that are spanned by the title section should be excluded
  // From your renderDynamicHeaders, the title section spans columns 1-4 (colSpan={4})
  // and currentIndex starts at 5, so columns 0-4 are not available for dynamic headers

  const TITLE_SPAN_INDICES = [1, 2, 3, 4]; // Columns spanned by title section
  const EXCLUDED_COLUMN_IDS = ['row']; // Row column

  // Filter out columns that are already used by existing headers, row column, and title-spanned columns
  const usedColumnIndices = existingHeaders.flatMap(
    header => header.columnSpans
  );

  const baseAvailableColumns = availableColumns.filter(column => {
    const isRowColumn = EXCLUDED_COLUMN_IDS.includes(column.id);
    const isTitleSpanned = TITLE_SPAN_INDICES.includes(column.index);
    const isUsed = usedColumnIndices.includes(column.id);
    const isIndex0 = column.index === 0; // Also exclude index 0 (row number)

    // Only exclude indices 1-4 (title section), index 0 (row), and 'row' column. Allow index 5 (URL).
    return !isRowColumn && !isTitleSpanned && !isUsed && !isIndex0;
  });

  // Only allow contiguous left-to-right selection by ID
  let trulyAvailableColumns: typeof baseAvailableColumns = [];
  if (selectedColumns.length === 0) {
    trulyAvailableColumns = baseAvailableColumns;
  } else {
    // Find the rightmost selected column's index in baseAvailableColumns
    const selectedIndices = selectedColumns
      .map(id => baseAvailableColumns.findIndex(col => col.id === id))
      .sort((a, b) => a - b);
    const maxIdx = Math.max(...selectedIndices);
    trulyAvailableColumns = baseAvailableColumns.filter(
      (col, idx) => selectedColumns.includes(col.id) || idx === maxIdx + 1
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Action"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Action Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-borderTertiary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter action name..."
            required
          />
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Color
          </label>
          <div className="grid grid-cols-3 gap-2">
            {headerColorOptions.map(color => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`p-3 rounded-md border-2 transition-all ${
                  selectedColor.name === color.name
                    ? 'border-primary ring-2 ring-primary ring-opacity-50'
                    : 'border-borderTertiary hover:border-primary'
                }`}
              >
                <div
                  className="w-full h-8 rounded"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs mt-1 block text-primary">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Column Selection */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Select Columns to Span
          </label>
          <p className="text-xs text-tertiary mb-2">
            You can only select a contiguous block of columns from left to
            right. To add more, select the next column to the right.
          </p>
          {trulyAvailableColumns.length === 0 ? (
            <p className="text-sm text-tertiary py-2">
              No available columns to span. All columns are already used by
              other actions.
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto border border-borderTertiary rounded-md p-3">
              {trulyAvailableColumns.map(column => (
                <label
                  key={column.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-secondary p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column.id)}
                    onChange={() => handleColumnToggle(column.id)}
                    className="w-4 h-4 text-primary border-borderTertiary rounded focus:ring-primary"
                  />
                  <span className="text-sm text-primary">
                    {column.name} (index: {column.index})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Selected Columns Summary */}
        {selectedColumns.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Selected Columns
            </label>
            <div className="flex flex-wrap gap-1">
              {selectedColumns.map(columnId => {
                const column = availableColumns.find(c => c.id === columnId);
                return (
                  <span
                    key={columnId}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-xs text-primary rounded"
                  >
                    {column?.name} (idx: {column?.index})
                    <button
                      type="button"
                      onClick={() => handleColumnToggle(columnId)}
                      className="ml-1 text-tertiary hover:text-primary"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-borderTertiary">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-tertiary hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || selectedColumns.length === 0}
            className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Action
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewActionModal;
