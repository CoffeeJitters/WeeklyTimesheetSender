import { useRef, useEffect, useState } from 'react'

const SignaturePad = ({ value, onChange }) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set responsive canvas size
    const updateCanvasSize = () => {
      const container = canvas.parentElement
      if (!container) return
      
      const containerWidth = container.clientWidth
      const isMobile = window.innerWidth < 768
      
      // Mobile: use full width, desktop: max 400px
      const width = isMobile ? containerWidth : Math.min(400, containerWidth)
      const height = isMobile ? 200 : 150
      
      // Set display size
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      
      // Set actual canvas resolution (for crisp rendering)
      const scale = window.devicePixelRatio || 1
      canvas.width = width * scale
      canvas.height = height * scale
      
      // Scale context to handle device pixel ratio
      const ctx = canvas.getContext('2d')
      ctx.scale(scale, scale)
      
      // Re-apply styles
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = isMobile ? 3 : 2 // Thicker lines on mobile for better visibility
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // Reload existing signature if present
      if (value) {
        const img = new Image()
        img.onload = () => {
          ctx.clearRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)
          setHasSignature(true)
        }
        img.onerror = () => {
          ctx.clearRect(0, 0, width, height)
          setHasSignature(false)
        }
        img.src = value
      } else {
        ctx.clearRect(0, 0, width, height)
        setHasSignature(false)
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [value])

  const getCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / (rect.width * (window.devicePixelRatio || 1))
    const scaleY = canvas.height / (rect.height * (window.devicePixelRatio || 1))

    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const coords = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(coords.x, coords.y)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const coords = getCoordinates(e)
    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()
  }

  const stopDrawing = (e) => {
    e.preventDefault()
    if (isDrawing) {
      setIsDrawing(false)
      const canvas = canvasRef.current
      const dataURL = canvas.toDataURL('image/png')
      setHasSignature(true)
      if (onChange) {
        onChange(dataURL)
      }
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    if (onChange) {
      onChange('')
    }
  }

  return (
    <div className="signature-pad-container w-full">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="border border-gray-300 rounded cursor-crosshair bg-white w-full max-w-md"
        style={{ touchAction: 'none', display: 'block' }}
      />
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={clearSignature}
          className="px-4 py-2.5 md:px-3 md:py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700 min-h-[44px] md:min-h-0"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default SignaturePad

