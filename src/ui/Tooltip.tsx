import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<React.ElementRef<'div'>>(null);
  const tooltipRef = useRef<React.ElementRef<'div'>>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.top - tooltipRect.height - 8;
          break;
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.bottom + 8;
          break;
        case 'left':
          x = triggerRect.left - tooltipRect.width - 8;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
        case 'right':
          x = triggerRect.right + 8;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
      }

      // Ensure tooltip stays within viewport
      const viewportWidth = window?.innerWidth ?? 0;
      const viewportHeight = window?.innerHeight ?? 0;

      if (x < 8) x = 8;
      if (x + tooltipRect.width > viewportWidth - 8) {
        x = viewportWidth - tooltipRect.width - 8;
      }
      if (y < 8) y = 8;
      if (y + tooltipRect.height > viewportHeight - 8) {
        y = viewportHeight - tooltipRect.height - 8;
      }

      setTooltipPosition({ x, y });
    }
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      ref={triggerRef}
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-1 text-primary bg-white border border-borderSecondary rounded-md shadow-lg whitespace-nowrap pointer-events-none text-xs"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${
              position === 'top'
                ? 'top-full left-1/2 -translate-x-1/2 -mt-[1px] border-l-transparent border-r-transparent border-b-transparent border-t-borderSecondary after:absolute after:top-[-5px] after:left-[-4px] after:border-4 after:border-l-transparent after:border-r-transparent after:border-b-transparent after:border-t-white'
                : position === 'bottom'
                  ? 'bottom-full left-1/2 -translate-x-1/2 mb-[-1px] border-l-transparent border-r-transparent border-t-transparent border-b-borderSecondary after:absolute after:bottom-[-5px] after:left-[-4px] after:border-4 after:border-l-transparent after:border-r-transparent after:border-t-transparent after:border-b-white'
                  : position === 'left'
                    ? 'left-full top-1/2 -translate-y-1/2 -ml-[1px] border-t-transparent border-b-transparent border-r-transparent border-l-borderSecondary after:absolute after:left-[-5px] after:top-[-4px] after:border-4 after:border-t-transparent after:border-b-transparent after:border-r-transparent after:border-l-white'
                    : 'right-full top-1/2 -translate-y-1/2 mr-[-1px] border-t-transparent border-b-transparent border-l-transparent border-r-borderSecondary after:absolute after:right-[-5px] after:top-[-4px] after:border-4 after:border-t-transparent after:border-b-transparent after:border-l-transparent after:border-r-white'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
