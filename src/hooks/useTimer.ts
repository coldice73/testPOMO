import { useState, useEffect, useCallback, useRef } from 'react'
import type { TimerMode, TimerSettings, UseTimerReturn, PomodoroRecord } from '../types'

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
}

const STORAGE_KEY = 'pomodoro-settings'
const HISTORY_KEY = 'pomodoro-history'

function loadSettings(): TimerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS
}

function saveSettings(s: TimerSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

function loadHistory(): PomodoroRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

function saveHistory(records: PomodoroRecord[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
}

export function useTimer(): UseTimerReturn {
  const [settings, setSettings] = useState<TimerSettings>(loadSettings)
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60)
  const [isRunning, setRunning] = useState(false)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [task, setTask] = useState('')
  const [history, setHistory] = useState<PomodoroRecord[]>(loadHistory)
  const [currentRecord, setCurrentRecord] = useState<PomodoroRecord | null>(null)

  const modeRef = useRef<TimerMode>('work')
  const settingsRef = useRef(settings)
  const taskRef = useRef('')
  const pomodoroCountRef = useRef(0)

  // 同步 refs
  useEffect(() => { modeRef.current = mode }, [mode])
  useEffect(() => { settingsRef.current = settings }, [settings])
  useEffect(() => { taskRef.current = task }, [task])
  useEffect(() => { pomodoroCountRef.current = pomodoroCount }, [pomodoroCount])

  // 计算下一个模式
  const getNextMode = useCallback((): { mode: TimerMode; duration: number } => {
    const s = settingsRef.current
    const count = pomodoroCountRef.current
    if (modeRef.current === 'work') {
      // 完成一个工作段 → 判断是否该长休息
      const nextCount = count + 1
      if (nextCount % s.longBreakInterval === 0) {
        return { mode: 'longBreak', duration: s.longBreakDuration * 60 }
      }
      return { mode: 'break', duration: s.breakDuration * 60 }
    }
    // break 或 longBreak 结束 → 回到 work
    return { mode: 'work', duration: s.workDuration * 60 }
  }, [])

  const switchMode = useCallback((): void => {
    const { mode: nextMode, duration } = getNextMode()
    modeRef.current = nextMode
    setMode(nextMode)
    setTimeLeft(duration)
    if (nextMode === 'work') {
      setPomodoroCount(prev => prev + 1)
    }
  }, [getNextMode])

  // 核心计时逻辑
  useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (prev === 1) return 0
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [isRunning])

  // 检测 timeLeft 归零 → 自动切换模式 & 记录完成
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      // 记录完成
      const completedMode = modeRef.current
      if (completedMode === 'work') {
        const record: PomodoroRecord = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          timestamp: Date.now(),
          duration: settingsRef.current.workDuration * 60,
          task: taskRef.current,
          mode: 'work',
          completed: true,
        }
        const updated = [record, ...loadHistory()]
        saveHistory(updated)
        setHistory(updated)
        setCurrentRecord(record)
      }
      switchMode()
    }
  }, [isRunning, timeLeft, switchMode])

  const getModeDuration = useCallback((): number => {
    const s = settingsRef.current
    const m = modeRef.current
    if (m === 'work') return s.workDuration * 60
    if (m === 'longBreak') return s.longBreakDuration * 60
    return s.breakDuration * 60
  }, [])

  const updateSettings = useCallback((partial: Partial<TimerSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial }
      saveSettings(next)
      return next
    })
  }, [])

  const start = useCallback(() => {
    if (isRunning) return
    setTimeLeft(prev => {
      if (prev <= 0) return getModeDuration()
      return prev
    })
    setRunning(true)
  }, [isRunning, getModeDuration])

  const pause = useCallback(() => {
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    setTimeLeft(getModeDuration())
    setRunning(false)
  }, [getModeDuration])

  // 设置变更时，如果未运行且模式匹配，同步 timeLeft
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(settings.workDuration * 60)
    }
  }, [settings.workDuration])

  // 派生值
  const totalTime = getModeDuration()
  const progress = totalTime > 0 ? 1 - (timeLeft / totalTime) : 0

  return {
    mode,
    timeLeft,
    totalTime,
    isRunning,
    progress,
    start,
    pause,
    reset,
    settings,
    updateSettings,
    pomodoroCount,
    task,
    setTask,
    currentRecord,
  }
}
