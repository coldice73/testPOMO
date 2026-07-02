import { useEffect } from 'react'
import { useTimer } from './hooks/useTimer'
import { TimerDisplay } from './components/TimerDisplay'
import { ControlButtons } from './components/ControlButtons'
import { formatTime } from './utils'

export default function App() {
  const {
    timeLeft,
    mode,
    totalTime,
    isRunning,
    progress,
    start,
    pause,
    reset,
  } = useTimer()

  // 页面标题实时更新
  useEffect(() => {
    const modeLabel = mode === 'work' ? '🍅 工作' : '☕ 休息'
    document.title = `[${formatTime(timeLeft)}] ${modeLabel} - 番茄钟`
  }, [timeLeft, mode])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-8">
      <TimerDisplay
        timeLeft={timeLeft}
        mode={mode}
        progress={progress}
        totalTime={totalTime}
      />
      <ControlButtons
        isRunning={isRunning}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />
    </div>
  )
}
