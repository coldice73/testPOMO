export type TimerMode = 'work' | 'break' | 'longBreak'

export type Lang = 'zh' | 'en'

export interface TimerSettings {
  workDuration: number       // 工作分钟数
  breakDuration: number      // 短休息分钟数
  longBreakDuration: number  // 长休息分钟数
  longBreakInterval: number  // 每 N 个工作后触发长休息
}

export interface TimerState {
  mode: TimerMode
  timeLeft: number
  totalTime: number
  isRunning: boolean
  progress: number           // 0-1
}

export interface PomodoroRecord {
  id: string
  timestamp: number          // Date.now()
  duration: number           // 实际完成的秒数（用于统计）
  task: string               // 关联的任务描述
  mode: TimerMode
  completed: boolean         // 是否完整完成（未被中断重置）
}

export interface HistoryStats {
  totalPomodoros: number
  totalWorkMinutes: number
  todayPomodoros: number
  todayWorkMinutes: number
}

export type UseTimerReturn = TimerState & {
  start: () => void
  pause: () => void
  reset: () => void
  settings: TimerSettings
  updateSettings: (s: Partial<TimerSettings>) => void
  pomodoroCount: number
  task: string
  setTask: (t: string) => void
  currentRecord: PomodoroRecord | null
}
