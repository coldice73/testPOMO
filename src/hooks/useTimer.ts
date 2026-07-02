import { useState, useEffect, useCallback, useRef } from 'react'
import type { TimerMode, UseTimerReturn } from '../types'

const WORK_DURATION = 25 * 60  // 1500 秒
const BREAK_DURATION = 5 * 60  // 300 秒

export function useTimer(): UseTimerReturn {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION)
  const [isRunning, setRunning] = useState(false)
  const lastTickRef = useRef<number | null>(null)
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
    if (!isRunning) {
      lastTickRef.current = null
      return
    }

    // 将基准时间戳回拨 800ms，让第一次 tick 大约 1 秒后触发
    lastTickRef.current = Date.now() - 800
    const id = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - (lastTickRef.current ?? now)) / 1000)
      if (elapsed >= 1) {
        lastTickRef.current = now  // 重置基准时间戳
        setTimeLeft(prev => {
          if (prev <= 1) {
            // 先返回 0，显示 00:00 一帧
            if (prev === 1) return 0
            // 已经是 0 → 不做任何事，由下面的 useEffect 检测并切换
            return 0
          }
          return prev - elapsed  // 扣除实际经过的秒数
        })
      }
    }, 1000)  // 1 秒精度，Date.now() 时间差策略保证准确

    return () => clearInterval(id)  // cleanup: 组件卸载时清理
  }, [isRunning])

  // 检测 timeLeft 归零 → 自动切换模式
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      switchMode()
    }
  }, [isRunning, timeLeft, switchMode])

  const start = useCallback(() => {
    if (isRunning) return  // 幂等守卫: 防止快速双击或已运行时重复启动
    setTimeLeft(prev => {
      if (prev <= 0) return currentModeDuration()  // 倒计时已结束则重置
      return prev
    })
    setRunning(true)
    lastTickRef.current = Date.now()
  }, [isRunning, currentModeDuration])

  const pause = useCallback(() => {
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    setTimeLeft(currentModeDuration())
    setRunning(false)
  }, [currentModeDuration])

  // 派生值
  const totalTime = currentModeDuration()
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
