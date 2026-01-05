import { useState, useRef, useEffect } from 'react'
import TimeWheelPicker from './TimeWheelPicker'

const TimeCell = ({ value, onChange, defaultTime = null }) => {
  const [isOpen, setIsOpen] = useState(false)
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1.5 md:py-1 border border-gray-300 rounded text-xs md:text-xs text-left focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-gray-400 bg-white min-h-[44px] md:min-h-0"
      >
        {value || '--:--'}
      </button>
      {isOpen && (
        <div className="fixed md:absolute z-50 md:z-50" style={{ 
          left: 0, 
          right: 0,
          bottom: 0,
          top: 'auto',
          marginTop: 0,
          marginBottom: 0,
        }}>
          <div className="md:relative md:left-0 md:right-auto md:bottom-auto md:top-full md:mt-1">
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

