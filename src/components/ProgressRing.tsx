import type { TimerMode } from '../types'

interface ProgressRingProps {
  progress: number       // 0-1，已消耗比例
  mode: TimerMode        // 决定颜色
  size?: number          // 默认 280
  strokeWidth?: number   // 默认 8
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

  const color = mode === 'work' ? '#ef4444' : '#3b82f6'
  const bgColor = '#334155'

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="drop-shadow-lg"
    >
      {/* 背景环 */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
      />
      {/* 前景弧 */}
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
