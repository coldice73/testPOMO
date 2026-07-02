import type { TimerMode } from '../types'

interface ProgressRingProps {
  progress: number
  mode: TimerMode
  size?: number
  strokeWidth?: number
}

const modeColors: Record<TimerMode, string> = {
  work: '#ef4444',
  break: '#3b82f6',
  longBreak: '#8b5cf6',
}

export function ProgressRing({
  progress,
  mode,
  size = 280,
  strokeWidth = 8,
}: ProgressRingProps) {
  const center = size / 2
  const radius = center - strokeWidth
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  const color = modeColors[mode]
  const bgColor = '#334155'

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="drop-shadow-lg"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        style={{
          transition: 'stroke-dashoffset 0.5s linear, stroke 0.3s ease',
        }}
      />
    </svg>
  )
}
