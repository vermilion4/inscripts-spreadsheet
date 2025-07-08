import React, { useState, useRef, useEffect } from 'react'
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { createNewSheet, SheetData, saveSheetsToStorage } from '../constants/SheetData'

interface FooterProps {
  sheets: SheetData[];
  activeSheetId: string;
  onSheetChange?: (sheetData: SheetData) => void;
  onSheetsChange?: (sheets: SheetData[]) => void;
}

const Footer = ({ sheets, activeSheetId, onSheetChange, onSheetsChange }: FooterProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [plusButtonSticky, setPlusButtonSticky] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const addNewSheet = () => {
    const newSheetNumber = sheets.length + 1
    const newSheet = createNewSheet(newSheetNumber)
    const newSheets = [...sheets, newSheet]
    
    // Save to localStorage
    saveSheetsToStorage(newSheets)
    
    // Notify parent component about the new sheets and active sheet
    if (onSheetsChange) {
      onSheetsChange(newSheets)
    }
    if (onSheetChange) {
      onSheetChange(newSheet)
    }
    
    // Update active tab to the new sheet
    setActiveTab(newSheets.length - 1)
    
    // Wait for DOM update before scrolling
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        container.scrollTo({
          left: container.scrollWidth,
          behavior: 'smooth'
        })
      }
    }, 0)
  }

  const handleSheetClick = (index: number) => {
    setActiveTab(index)
    // Notify parent component about the active sheet change
    if (onSheetChange) {
      onSheetChange(sheets[index])
    }
  }

  // Update active tab when activeSheetId changes or sheets array changes
  useEffect(() => {
    const activeIndex = sheets.findIndex(sheet => sheet.id === activeSheetId);
    if (activeIndex !== -1) {
      setActiveTab(activeIndex);
    } else if (sheets.length > 0) {
      // If active sheet not found, default to first sheet
      setActiveTab(0);
    }
  }, [activeSheetId, sheets]);

  const checkScrollState = () => {
    if (scrollContainerRef.current && contentRef.current) {
      const container = scrollContainerRef.current
      const content = contentRef.current
      const { scrollLeft, scrollWidth, clientWidth } = container
      
      // Check if we need scroll arrows
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth)
      
      // Check if plus button should be sticky
      const contentWidth = content.scrollWidth
      const availableWidth = container.clientWidth
      setPlusButtonSticky(contentWidth > availableWidth)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -120, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 120, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    checkScrollState()
    const handleResize = () => checkScrollState()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sheets])



  return (
    <footer className='h-12 fixed bottom-0 w-full bg-white border-t border-borderTertiary pl-4 md:pl-8 pt-1 z-50'>
      <div className='flex items-center h-full'>
        {/* Left scroll button */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className='px-1 py-[10px] h-11 text-tertiary hover:text-primary flex-shrink-0 z-10 mt-[2px]'
            aria-label="Scroll left"
          >
            <FiChevronLeft className="w-4 sm:w-6 h-4 sm:h-6" />
          </button>
        )}
        
        {/* Scrollable tabs container */}
        <div className='flex-1 relative overflow-hidden min-w-0'>
          <div 
            ref={scrollContainerRef}
            className='overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
            onScroll={checkScrollState}
          >
            <div 
              ref={contentRef}
              className='flex items-center whitespace-nowrap'
            >
              {sheets.map((sheet, index) => (
                <button
                  key={sheet.id}
                  onClick={() => handleSheetClick(index)}
                  className={`px-4 py-[10px] h-11 cursor-pointer hover:bg-primary-100 border-t-2 hover:border-default font-medium flex-shrink-0 ${
                    activeTab === index 
                      ? 'bg-primary-100 text-primary-700 border-default font-semibold' 
                      : 'text-tertiary border-transparent'
                  }`}
                >
                  {sheet.name}
                </button>
              ))}
              {/* Plus button always as last child, sticky when needed */}
              <button 
                onClick={addNewSheet}
                className={`px-3 py-[10px] h-11 text-tertiary hover:text-primary flex-shrink-0 border-t-2 border-transparent ${plusButtonSticky ? 'sticky right-0 z-20 bg-white' : ''}`}
                aria-label="Add new sheet"
              >
                <FiPlus className="w-4 sm:w-6 h-4 sm:h-6" />
              </button>
            </div>
          </div>
          
          {/* Gradient fade effect on right when scrollable */}
          {showRightArrow && (
            <div className='absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none' />
          )}
        </div>
        
        {/* Right scroll button */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className='px-1 py-[10px] h-11 text-tertiary hover:text-primary flex-shrink-0 z-10 mt-[2px]'
            aria-label="Scroll right"
          >
            <FiChevronRight className="w-4 sm:w-6 h-4 sm:h-6" />
          </button>
        )}
      </div>
    </footer>
  )
}

export default Footer