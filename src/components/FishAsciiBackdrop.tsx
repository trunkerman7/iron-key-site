import { useEffect, useRef } from 'react'

const FRAME_INTERVAL = 40
const FRAME_COUNT = 83
const FRAME_WIDTH = 240
const FRAME_HEIGHT = 135
const FRAME_COLUMNS = 10
const CHARSET = ' .,:;~-+=*xX#%&@'
const SAMPLE_BACKGROUND = '#080b13'
const GREEN_TONES = ['#214f43', '#6daf98', '#d1eadf']

export default function FishAsciiBackdrop({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    const sampler = document.createElement('canvas')
    const sampleContext = sampler.getContext('2d', { willReadFrequently: true })
    if (!context || !sampleContext) return

    const source = new Image()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compactLayout = window.matchMedia('(max-width: 40rem)')
    let columns = 0
    let rows = 0
    let cellWidth = 6
    let cellHeight = 10
    let cssWidth = 0
    let cssHeight = 0
    let lastPaint = -Infinity
    let animationFrame = 0
    let resizeFrame = 0
    let running = false
    let visible = true
    let loaded = false
    let destroyed = false
    let sourceStart = 0

    function luminance(data: Uint8ClampedArray, index: number) {
      return (data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722) / 255
    }

    function drawSource(now: number) {
      sampleContext!.fillStyle = SAMPLE_BACKGROUND
      sampleContext!.fillRect(0, 0, columns, rows)

      const sourceRatio = FRAME_WIDTH / FRAME_HEIGHT
      const targetRatio = cssWidth / cssHeight
      const frame = reduceMotion.matches
        ? 0
        : Math.floor(Math.max(0, now - sourceStart) / FRAME_INTERVAL) % FRAME_COUNT
      const sourceLeft = (frame % FRAME_COLUMNS) * FRAME_WIDTH
      const sourceTop = Math.floor(frame / FRAME_COLUMNS) * FRAME_HEIGHT
      let drawWidth: number
      let drawHeight: number

      if (compactLayout.matches) {
        if (targetRatio > sourceRatio) {
          drawHeight = cssHeight
          drawWidth = drawHeight * sourceRatio
        } else {
          drawWidth = cssWidth
          drawHeight = drawWidth / sourceRatio
        }
        const drawLeft = (cssWidth - drawWidth) * 0.5 / cellWidth
        const drawTop = Math.max(0, (cssHeight - drawHeight) * 0.28) / cellHeight
        sampleContext!.drawImage(
          source,
          sourceLeft,
          sourceTop,
          FRAME_WIDTH,
          FRAME_HEIGHT,
          drawLeft,
          drawTop,
          drawWidth / cellWidth,
          drawHeight / cellHeight,
        )
        return
      }

      if (targetRatio > sourceRatio) {
        drawWidth = cssWidth
        drawHeight = drawWidth / sourceRatio
      } else {
        drawHeight = cssHeight
        drawWidth = drawHeight * sourceRatio
      }
      const drawLeft = (cssWidth - drawWidth) * 0.5 / cellWidth
      const drawTop = (cssHeight - drawHeight) * 0.5 / cellHeight
      sampleContext!.drawImage(
        source,
        sourceLeft,
        sourceTop,
        FRAME_WIDTH,
        FRAME_HEIGHT,
        drawLeft,
        drawTop,
        drawWidth / cellWidth,
        drawHeight / cellHeight,
      )
    }

    function paint(now = performance.now(), force = false) {
      if (!loaded || destroyed || !columns || !rows) return
      if (!force && now - lastPaint < FRAME_INTERVAL) return
      lastPaint = now
      drawSource(now)

      const pixels = sampleContext!.getImageData(0, 0, columns, rows).data
      const luma = new Float32Array(columns * rows)
      for (let index = 0; index < luma.length; index += 1) {
        luma[index] = luminance(pixels, index * 4)
      }

      context!.clearRect(0, 0, cssWidth, cssHeight)
      const shift = compactLayout.matches ? 0 : Math.round(columns * 0.17)

      for (let row = 0; row < rows; row += 1) {
        const layers = [Array(columns).fill(' '), Array(columns).fill(' '), Array(columns).fill(' ')]
        const verticalPosition = row / Math.max(1, rows - 1)

        for (let column = 0; column < columns; column += 1) {
          const destination = column + shift
          if (destination >= columns) break

          const cell = row * columns + column
          const pixel = cell * 4
          const red = pixels[pixel]
          const green = pixels[pixel + 1]
          const blue = pixels[pixel + 2]
          const lum = luma[cell]
          const left = luma[row * columns + Math.max(0, column - 1)]
          const right = luma[row * columns + Math.min(columns - 1, column + 1)]
          const above = luma[Math.max(0, row - 1) * columns + column]
          const below = luma[Math.min(rows - 1, row + 1) * columns + column]
          const localAverage = (left + right + above + below) * 0.25
          const detail = Math.abs(lum - localAverage)
          const edge = Math.max(Math.abs(left - right), Math.abs(above - below))
          const chroma = (Math.max(red, green, blue) - Math.min(red, green, blue)) / 255
          const horizontalPosition = column / Math.max(1, columns - 1)
          const central = ((horizontalPosition - 0.515) / 0.24) ** 2 + ((verticalPosition - 0.41) / 0.31) ** 2 < 1
          const orange = red > 155 && red > green * 1.12 && red > blue * 1.38
          const white = central && Math.min(red, green, blue) > 160 && Math.max(red, green, blue) - Math.min(red, green, blue) < 95
          const fish = orange ? 1 : white ? 0.78 : 0
          const raw = 0.018 + 0.13 * lum + 1.18 * detail + 0.52 * edge + 0.1 * chroma + 0.64 * fish
          const signal = Math.min(1, Math.max(0, raw)) ** 0.93
          const glyph = CHARSET[Math.min(CHARSET.length - 1, Math.floor(signal * CHARSET.length))]
          const tone = signal < 0.26 ? 0 : signal < 0.5 ? 1 : 2
          layers[tone][destination] = glyph
        }

        for (let tone = 0; tone < layers.length; tone += 1) {
          context!.fillStyle = GREEN_TONES[tone]
          context!.fillText(layers[tone].join(''), 0, row * cellHeight)
        }
      }
    }

    function measure() {
      if (destroyed) return
      cssWidth = canvas!.clientWidth
      cssHeight = canvas!.clientHeight
      if (!cssWidth || !cssHeight) return

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(cssWidth * pixelRatio)
      canvas!.height = Math.round(cssHeight * pixelRatio)
      context!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      const fontSize = compactLayout.matches ? 9 : 10
      const mono = getComputedStyle(canvas!).fontFamily || 'ui-monospace, monospace'
      context!.font = `500 ${fontSize}px ${mono}`
      context!.textBaseline = 'top'
      cellWidth = Math.max(5, Math.round(context!.measureText('M').width))
      cellHeight = fontSize
      columns = Math.ceil(cssWidth / cellWidth)
      rows = Math.ceil(cssHeight / cellHeight)
      sampler.width = columns
      sampler.height = rows
      paint(performance.now(), true)
    }

    function loop(now: number) {
      if (!running) return
      paint(now)
      animationFrame = window.requestAnimationFrame(loop)
    }

    function start() {
      if (running || destroyed || !loaded || reduceMotion.matches) return
      running = true
      animationFrame = window.requestAnimationFrame(loop)
    }

    function stop() {
      if (!running) return
      running = false
      window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }

    function syncPlayback() {
      if (visible && !document.hidden && !reduceMotion.matches) start()
      else {
        stop()
        paint(performance.now(), true)
      }
    }

    function scheduleMeasure() {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0
        measure()
        syncPlayback()
      })
    }

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncPlayback()
    }, { rootMargin: '100px' })
    const resize = new ResizeObserver(scheduleMeasure)

    source.decoding = 'async'
    source.addEventListener('load', () => {
      loaded = true
      sourceStart = performance.now()
      measure()
      syncPlayback()
    }, { once: true })
    source.src = '/media/fish-koi-frames.webp'

    visibility.observe(canvas)
    resize.observe(canvas)
    document.addEventListener('visibilitychange', syncPlayback)
    reduceMotion.addEventListener('change', syncPlayback)
    compactLayout.addEventListener('change', scheduleMeasure)

    return () => {
      destroyed = true
      stop()
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
      visibility.disconnect()
      resize.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      reduceMotion.removeEventListener('change', syncPlayback)
      compactLayout.removeEventListener('change', scheduleMeasure)
      source.src = ''
    }
  }, [])

  return <canvas ref={canvasRef} className={`fish-ascii-backdrop ${className}`.trim()} aria-hidden="true" />
}
