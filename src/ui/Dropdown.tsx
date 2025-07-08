import React, { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  id: string | number;
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  customComponent?: React.ReactNode;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: string;
  className?: string;
  triggerClassName?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'bottom',
  width = 'w-64',
  className = '',
  triggerClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.onClick && !item.disabled) {
      item.onClick();
    }
    setIsOpen(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full right-0 mb-2';
      case 'bottom':
        return 'top-full right-0 mt-4';
      case 'left':
        return 'top-0 right-full mr-2';
      case 'right':
        return 'top-0 left-full ml-2';
      default:
        return 'top-full right-0 mt-2';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={triggerRef}
        className={`cursor-pointer ${triggerClassName}`}
        onClick={handleToggle}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-[100] bg-white shadow-lg rounded-md border border-borderTertiary ${width} ${getPositionClasses()}`}
        >
          <div className="py-1">
            {items.map(item => (
              <React.Fragment key={item.id}>
                {item.divider ? (
                  <div className="border-t border-borderTertiary my-1" />
                ) : (
                  <div
                    className={`px-3 py-2 text-sm transition-colors ${
                      item.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-gray-100'
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.customComponent ? (
                      item.customComponent
                    ) : (
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <div className="w-4 h-4 flex items-center justify-center">
                            {item.icon}
                          </div>
                        )}
                        <span className={item.icon ? '' : 'ml-7'}>
                          {item.label}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
