import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface PopoverProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  children: React.ReactNode;
  minWidth?: number | string;
  className?: string;
}

const Popover: React.FC<PopoverProps> = ({ open, anchorRef, onClose, children, minWidth = 320, className }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ display: 'none' });

  // Position popover on open and on scroll/resize
  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const anchorRect = anchorRef.current.getBoundingClientRect();
    const width = typeof minWidth === 'number' ? minWidth : 320;
    let left = anchorRect.left + window.scrollX - (Number(width) / 2) + anchorRect.width / 2;
    let top = anchorRect.bottom + window.scrollY + 8;
    // Prevent overflow on right edge
    const margin = 8;
    const popoverWidth = Number(width);
    if (left + popoverWidth + margin > window.innerWidth) {
      // Align right edge of popover to right edge of trigger or viewport
      left = Math.max(window.innerWidth - popoverWidth - margin, margin);
    }
    if (left < margin) {
      left = margin;
    }
    setStyle({
      position: 'absolute',
      top,
      left,
      zIndex: 50,
      minWidth: width,
      background: 'white',
      border: '1px solid #EEEEEE',
      borderRadius: 8,
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
      padding: 0
    });
    function handleScrollOrResize() {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      let left = rect.left + window.scrollX - (Number(width) / 2) + rect.width / 2;
      let top = rect.bottom + window.scrollY + 8;
      if (left + popoverWidth + margin > window.innerWidth) {
        left = Math.max(window.innerWidth - popoverWidth - margin, margin);
      }
      if (left < margin) {
        left = margin;
      }
      setStyle(s => ({ ...s, top, left }));
    }
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [open, anchorRef, minWidth]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div ref={popoverRef} style={style} className={`shadow-lg ${className || ''}`}>
      {children}
    </div>,
    document.body
  );
};

export default Popover; 