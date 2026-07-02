import { useState, useEffect, useCallback, useRef } from 'react'
import type { TimerMode, UseTimerReturn } from '../types'

const WORK_DURATION = 25 * 60  // 1500 秒
const BREAK_DURATION = 5 * 60  // 300 秒

export function useTimer(): UseTimerReturn {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION)
  const [isRunning, setRunning] = useState(false)
  const modeRef = useRef<TimerMode>('work')

  // 保持 modeRef 与 state 同步
  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const switchMode = useCallback((): void => {
    const next = modeRef.current === 'work' ? 'break' : 'work'
    const nextDuration = next === 'work' ? WORK_DURATION : BREAK_DURATION
    modeRef.current = next
    setMode(next)
    setTimeLeft(nextDuration)
  }, [])

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

    return () => clearInterval(id)  // cleanup: 组件卸载时清理
  }, [isRunning])

  // 检测 timeLeft 归零 → 自动切换模式
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      switchMode()
    }
  }, [isRunning, timeLeft, switchMode])

  const getModeDuration = useCallback((): number => {
    return modeRef.current === 'work' ? WORK_DURATION : BREAK_DURATION
  }, [])

  const start = useCallback(() => {
    if (isRunning) return  // 幂等守卫: 防止快速双击或已运行时重复启动
    setTimeLeft(prev => {
      if (prev <= 0) return getModeDuration()  // 倒计时已结束则重置
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

  // 派生值
  const totalTime = getModeDuration()
  const progress = 1 - (timeLeft / totalTime)

  return {
    mode,
    timeLeft,
    totalTime,
    isRunning,
    progress,
    start,
    pause,
    reset,
  }
}
