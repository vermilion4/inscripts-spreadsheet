import { FiEdit3, FiCopy, FiShare2, FiDownload, FiTrash2 } from 'react-icons/fi';
import { JSX } from 'react';

interface Notification {
  id: number;
  text: string;
}

interface MenuItem {
  id: string;
  label?: string;
  icon?: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export const notifications: Notification[] = [
  { id: 1, text: "John Doe commented on your spreadsheet" },
  { id: 2, text: "New shared folder invitation" },
];

export const ellipsisMenuItems: MenuItem[] = [
  {
    id: 'rename',
    label: 'Rename',
    icon: <FiEdit3 className="w-4 h-4 text-tertiary" /> as JSX.Element,
    onClick: () => console.log('Rename clicked')
  },
  {
    id: 'duplicate', 
    label: 'Duplicate',
    icon: <FiCopy className="w-4 h-4 text-tertiary" /> as JSX.Element,
    onClick: () => console.log('Duplicate clicked')
  },
  {
    id: 'divider1',
    divider: true
  },
  {
    id: 'share',
    label: 'Share', 
    icon: <FiShare2 className="w-4 h-4 text-tertiary" /> as JSX.Element,
    onClick: () => console.log('Share clicked')
  },
  {
    id: 'export',
    label: 'Export',
    icon: <FiDownload className="w-4 h-4 text-tertiary" /> as JSX.Element,
    onClick: () => console.log('Export clicked')
  },
  {
    id: 'divider2',
    divider: true
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <FiTrash2 className="w-4 h-4 text-red-500" /> as JSX.Element,
    onClick: () => console.log('Delete clicked'),
    disabled: true
  }
];
