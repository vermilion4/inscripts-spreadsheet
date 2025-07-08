import React, { useState, useRef } from 'react';
import actionIcon from '../assets/action.svg';
import shareIcon from '../assets/share.svg';
import importIcon from '../assets/import.svg';
import cellViewIcon from '../assets/cell-view.svg';
import filterIcon from '../assets/filter.svg';
import sortIcon from '../assets/sort.svg';
import hideIcon from '../assets/hide.svg';
import doubleArrow from '../assets/double-carat.svg';
import {
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiUsers,
  FiMail,
  FiDownload,
  FiUpload,
} from 'react-icons/fi';
import Tooltip from '../ui/Tooltip';
import Dropdown from '../ui/Dropdown';
import Popover from '../ui/Popover';
import { SheetData } from '../constants/SheetData';
import { importTemplates } from '../constants/Toolbar';

const ButtonVariants = {
  default:
    'text-xs sm:text-sm text-primary px-2 py-1 rounded hover:bg-secondary transition whitespace-nowrap',
  outlined:
    'text-xs sm:text-sm text-secondary-two px-3 py-2 hover:bg-secondary transition whitespace-nowrap border border-borderTertiary rounded-md',
  primary:
    'text-xs sm:text-sm font-medium px-3 sm:px-6 py-2 rounded-md bg-default text-secondary hover:opacity-90 transition whitespace-nowrap',
};

interface ToolbarButtonProps {
  icon: string;
  label: string;
  variant?: keyof typeof ButtonVariants;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
  showLabelOnMobile?: boolean;
  ref?: React.RefObject<HTMLButtonElement>;
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      icon,
      label,
      variant = 'default',
      className = '',
      onClick,
      isActive = false,
      showLabelOnMobile = true,
    },
    ref
  ) => (
    <Tooltip content={label} position="bottom">
      <button
        ref={ref}
        className={`flex items-center gap-1 group relative ${ButtonVariants[variant]} ${className} ${isActive ? 'bg-secondary' : ''}`}
        onClick={onClick}
        type="button"
      >
        <img
          src={icon}
          alt={label}
          className={`w-4 h-4 ${!showLabelOnMobile ? 'mx-auto' : ''}`}
        />
        <span
          className={`${showLabelOnMobile ? 'inline sm:inline' : 'hidden sm:inline'}`}
        >
          {label}
        </span>
      </button>
    </Tooltip>
  )
);

interface ToolbarProps {
  activeSheet?: SheetData | null;
  onImportSheet?: (sheet: SheetData) => void;
  onExportSheet?: (sheet: SheetData) => void;
  hiddenFields?: Set<number>;
  onHiddenFieldsChange?: (hiddenFields: Set<number>) => void;
}

const Toolbar = ({
  activeSheet,
  onImportSheet,
  onExportSheet,
  hiddenFields = new Set(),
  onHiddenFieldsChange,
}: ToolbarProps) => {
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const [activeTools, setActiveTools] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [hideFieldsPopoverOpen, setHideFieldsPopoverOpen] = useState(false);

  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const hideFieldsButtonRef = useRef<HTMLButtonElement>(null);

  // Available rows that can be hidden (show first 20 for demo)
  const availableRows = Array.from({ length: 20 }, (_, i) => i + 1);

  const leftTools = [
    { icon: hideIcon, label: 'Hide fields' },
    { icon: sortIcon, label: 'Sort' },
    { icon: filterIcon, label: 'Filter' },
    { icon: cellViewIcon, label: 'Cell view' },
  ];

  const handleToolClick = (toolLabel: string) => {
    alert(`Tool clicked: ${toolLabel}`);

    if (toolLabel === 'Hide fields') {
      // For hide fields, just toggle the popover without affecting active state
      setHideFieldsPopoverOpen(!hideFieldsPopoverOpen);
      return;
    }

    // For other tools, handle normal activation/deactivation
    const newActiveTools = new Set(activeTools);
    if (newActiveTools.has(toolLabel)) {
      newActiveTools.delete(toolLabel);
    } else {
      newActiveTools.add(toolLabel);
    }
    setActiveTools(newActiveTools);

    console.log(
      `${toolLabel} ${newActiveTools.has(toolLabel) ? 'activated' : 'deactivated'}`
    );
  };

  const handleFieldToggle = (rowIndex: number) => {
    const newHiddenFields = new Set(hiddenFields);
    if (newHiddenFields.has(rowIndex)) {
      newHiddenFields.delete(rowIndex);
    } else {
      newHiddenFields.add(rowIndex);
    }
    onHiddenFieldsChange?.(newHiddenFields);
  };

  const handleToolbarToggle = () => {
    setIsToolbarCollapsed(!isToolbarCollapsed);
  };

  const handleShareClick = () => {
    setSharePopoverOpen(open => !open);
  };

  const handleNewAction = () => {
    alert('New Action clicked');
  };

  const handleCopyLink = async () => {
    const shareLink =
      'https://sheets.example.com/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleImportTemplate = (template: SheetData) => {
    onImportSheet?.(template);
  };

  const handleExportSheet = () => {
    if (activeSheet) {
      onExportSheet?.(activeSheet);
    }
  };

  const mobileToolsItems = leftTools.map(tool => ({
    id: tool.label,
    label: tool.label,
    icon: <img src={tool.icon} alt={tool.label} className="w-4 h-4" />,
    onClick: () => handleToolClick(tool.label),
  }));

  const importItems = importTemplates.map(template => ({
    id: template.id,
    label: template.name,
    icon: <FiUpload className="w-4 h-4" />,
    onClick: () => handleImportTemplate(template),
  }));

  const exportItems = [
    {
      id: 'export-json',
      label: 'Export as JSON',
      icon: <FiDownload className="w-4 h-4" />,
      onClick: handleExportSheet,
    },
  ];

  const shareLink =
    'https://sheets.example.com/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';

  return (
    <div className="h-14 px-4 py-2 flex items-center bg-white border-b border-borderTertiary relative">
      <div className="flex items-center justify-between w-full gap-2 lg:gap-4">
        {/* Left section */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
          {/* Tool bar toggle/dropdown */}
          <div className="lg:hidden">
            <Dropdown
              trigger={
                <button
                  className="flex items-center gap-1.5 text-sm text-primary px-2 py-1 rounded hover:bg-secondary transition whitespace-nowrap"
                  type="button"
                >
                  <span className="inline">Tool bar</span>
                </button>
              }
              items={mobileToolsItems}
              width="w-40"
              position="right"
            />
          </div>
          <button
            className="hidden lg:flex items-center gap-1.5 text-sm text-primary px-2 py-1 rounded hover:bg-secondary transition whitespace-nowrap"
            onClick={handleToolbarToggle}
            type="button"
          >
            <span className="inline">Tool bar</span>
            <img
              src={doubleArrow}
              alt="toggle"
              className={`w-2.5 h-2.5 transition-transform ${isToolbarCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
          {/* Divider */}
          <div className="h-6 w-px border-r border-borderTertiary"></div>
          {/* Desktop tools */}
          <div
            className={`hidden lg:flex items-center gap-1 transition-all duration-300 ${isToolbarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            {leftTools.map((tool, index) => {
              if (tool.label === 'Hide fields') {
                return (
                  <ToolbarButton
                    key={index}
                    icon={tool.icon}
                    label={tool.label}
                    onClick={() => handleToolClick(tool.label)}
                    isActive={hideFieldsPopoverOpen}
                    ref={hideFieldsButtonRef}
                  />
                );
              }
              return (
                <ToolbarButton
                  key={index}
                  icon={tool.icon}
                  label={tool.label}
                  onClick={() => handleToolClick(tool.label)}
                  isActive={activeTools.has(tool.label)}
                />
              );
            })}
          </div>
        </div>
        {/* Right section */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Desktop right tools */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Import dropdown */}
            <Dropdown
              trigger={
                <button className="flex items-center gap-1 text-xs sm:text-sm text-secondary-two px-3 py-2 hover:bg-secondary transition whitespace-nowrap border border-borderTertiary rounded-md">
                  <img src={importIcon} alt="Import" className="w-4 h-4" />
                  <span className="hidden sm:inline">Import</span>
                </button>
              }
              items={importItems}
              width="w-48"
              position="left"
            />
            {/* Export dropdown */}
            <Dropdown
              trigger={
                <button className="flex items-center gap-1 text-xs sm:text-sm text-secondary-two px-3 py-2 hover:bg-secondary transition whitespace-nowrap border border-borderTertiary rounded-md [&>img]:rotate-180">
                  <img src={importIcon} alt="Export" className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              }
              items={exportItems}
              width="w-40"
              position="left"
            />
          </div>
          {/* Share button with popover */}
          <div className="relative">
            <Tooltip content="Share" position="bottom">
              <button
                ref={shareButtonRef}
                className="flex items-center gap-1 text-xs sm:text-sm text-secondary-two px-3 py-2 hover:bg-secondary transition whitespace-nowrap border border-borderTertiary rounded-md"
                onClick={handleShareClick}
                type="button"
              >
                <img src={shareIcon} alt="Share" className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </Tooltip>
            <Popover
              open={sharePopoverOpen}
              anchorRef={shareButtonRef}
              onClose={() => setSharePopoverOpen(false)}
              minWidth={320}
            >
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-primary mb-2">
                    Share "Spreadsheet 3"
                  </h3>
                  <p className="text-xs text-tertiary">
                    Anyone with the link can view this spreadsheet
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-primary">
                    Link to share
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 px-3 py-2 text-xs bg-secondary border border-borderTertiary rounded-md text-tertiary"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 px-3 py-2 text-xs bg-default text-secondary rounded-md hover:opacity-90 transition"
                    >
                      {copied ? (
                        <FiCheck className="w-3 h-3" />
                      ) : (
                        <FiCopy className="w-3 h-3" />
                      )}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-secondary text-xs text-primary"
                    onClick={() => alert('Share with specific people')}
                  >
                    <FiUsers className="w-4 h-4" /> Share with specific people
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-secondary text-xs text-primary"
                    onClick={() => alert('Send via email')}
                  >
                    <FiMail className="w-4 h-4" /> Send via email
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-secondary text-xs text-primary"
                    onClick={() => alert('Get embed code')}
                  >
                    <FiExternalLink className="w-4 h-4" /> Get embed code
                  </button>
                </div>
              </div>
            </Popover>
          </div>
          {/* Hide Fields popover */}
          <Popover
            open={hideFieldsPopoverOpen}
            anchorRef={hideFieldsButtonRef}
            onClose={() => {
              setHideFieldsPopoverOpen(false);
              console.log('Hide fields popover closed via onClose');
            }}
            minWidth={280}
          >
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-primary mb-2">
                  Hide Rows
                </h3>
                <p className="text-xs text-tertiary">
                  Select rows to hide from the spreadsheet
                </p>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableRows.map(rowNum => (
                  <label
                    key={rowNum}
                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-secondary cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={hiddenFields.has(rowNum)}
                      onChange={() => handleFieldToggle(rowNum)}
                      className="w-4 h-4 text-primary border-borderTertiary rounded focus:ring-primary"
                    />
                    <span className="text-xs text-primary">Row {rowNum}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between pt-2">
                <button
                  onClick={() => onHiddenFieldsChange?.(new Set())}
                  className="text-xs text-primary hover:text-secondary-two"
                >
                  Show All
                </button>
                <button
                  onClick={() => setHideFieldsPopoverOpen(false)}
                  className="text-xs text-primary hover:text-secondary-two"
                >
                  Done
                </button>
              </div>
            </div>
          </Popover>
          {/* New Action button */}
          <ToolbarButton
            icon={actionIcon}
            label="New Action"
            variant="primary"
            onClick={handleNewAction}
            showLabelOnMobile={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
