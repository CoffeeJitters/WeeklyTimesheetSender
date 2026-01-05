import { useState, useRef, useEffect } from 'react'
import TimeWheelPicker from './TimeWheelPicker'

const TimeCell = ({ value, onChange, defaultTime = null }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pickerPositionRef = useRef({ top: 0, left: 0 })
  const cellRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cellRef.current && !cellRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={cellRef} className="relative">
      <button
        type="button"
        onClick={() => {
          const willBeOpen = !isOpen
          // Calculate position synchronously before opening for desktop
          if (willBeOpen && window.innerWidth >= 768 && cellRef.current) {
            const rect = cellRef.current.getBoundingClientRect()
            pickerPositionRef.current = {
              top: rect.bottom + 4, // 4px margin (mt-1 = 4px)
              left: rect.left
            }
          }
          setIsOpen(willBeOpen)
        }}
        className="w-full px-2 py-1.5 md:py-1 border border-gray-300 rounded text-xs md:text-xs text-left focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-gray-400 bg-white min-h-[44px] md:min-h-0"
      >
        {value || '--:--'}
      </button>
      {isOpen && (
        <div 
          className="fixed top-0 left-0 right-0 md:fixed z-[9999] md:z-50" 
          style={window.innerWidth >= 768 ? {
            top: `${pickerPositionRef.current.top}px`,
            left: `${pickerPositionRef.current.left}px`,
            right: 'auto',
            bottom: 'auto'
          } : {}}
          ref={() => {}}
        >
          <div className="md:relative md:left-0 md:right-auto md:bottom-auto md:top-0">
            <TimeWheelPicker
              value={value}
              onChange={onChange}
              onClose={() => setIsOpen(false)}
              defaultTime={defaultTime}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeCell

