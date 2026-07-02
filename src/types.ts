export type TimerMode = 'work' | 'break'

export interface TimerState {
  mode: TimerMode
  timeLeft: number       // 当前倒计时秒数
  totalTime: number      // 当前模式总时长（秒），用于计算进度
  isRunning: boolean
  progress: number       // 进度 0-1
}

// useTimer 返回类型（组合 TimerState + 操作方法）
export type UseTimerReturn = TimerState & {
  start: () => void
  pause: () => void
  reset: () => void
}
