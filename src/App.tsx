import { useEffect, useState, useRef } from 'react'
import { useTimer } from './hooks/useTimer'
import { TimerDisplay } from './components/TimerDisplay'
import { ControlButtons } from './components/ControlButtons'
import { SettingsPanel } from './components/SettingsPanel'
import { StatsPanel } from './components/StatsPanel'
import { formatTime } from './utils'
import { t } from './i18n'
import { playNotification, sendBrowserNotification, requestNotificationPermission } from './notify'
import type { Lang } from './types'

const STORAGE_LANG = 'pomodoro-lang'

function loadLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_LANG)
    if (v === 'en' || v === 'zh') return v
  } catch { /* ignore */ }
  return 'zh'
}

function saveLang(l: Lang) {
  localStorage.setItem(STORAGE_LANG, l)
}

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
    settings,
    updateSettings,
    pomodoroCount,
    task,
    setTask,
    currentRecord,
  } = useTimer()

  const [lang, setLang] = useState<Lang>(loadLang)
  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const prevModeRef = useRef(mode)

  // 请求通知权限（用户首次交互后）
  useEffect(() => {
    const handler = () => {
      requestNotificationPermission()
      document.removeEventListener('click', handler)
    }
    document.addEventListener('click', handler, { once: true })
    return () => document.removeEventListener('click', handler)
  }, [])

  // 页面标题实时更新
  useEffect(() => {
    const titleKey = mode === 'work' ? 'title.work' : mode === 'longBreak' ? 'title.longBreak' : 'title.break'
    document.title = `[${formatTime(timeLeft)}] ${t(titleKey, lang)} - ${t('app.title', lang)}`
  }, [timeLeft, mode, lang])

  // 模式切换时播放音效 + 浏览器通知
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      const prev = prevModeRef.current
      prevModeRef.current = mode

      // 仅在自动切换（timeLeft === totalTime）时通知
      if (prev === 'work') {
        playNotification()
        sendBrowserNotification(t('notify.workDone', lang), t('app.title', lang))
      } else if (prev === 'break' || prev === 'longBreak') {
        playNotification()
        const key = prev === 'longBreak' ? 'notify.longBreakDone' : 'notify.breakDone'
        sendBrowserNotification(t(key, lang), t('app.title', lang))
      }
    }
  }, [mode, lang])

  const toggleLang = () => {
    setLang(prev => {
      const next: Lang = prev === 'zh' ? 'en' : 'zh'
      saveLang(next)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6 p-4">
      {/* 顶部：任务输入 + 设置/统计按钮 */}
      <div className="w-full max-w-md flex items-center gap-3">
        <input
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder={t('task.placeholder', lang)}
          disabled={isRunning}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-indigo-400 focus:outline-none text-sm disabled:opacity-50 transition-colors"
        />
        <button
          onClick={() => setShowStats(true)}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors text-lg"
          title={t('stats.title', lang)}
        >
          📊
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors text-lg"
          title={t('settings.title', lang)}
        >
          ⚙️
        </button>
      </div>

      {/* 计时器主体 */}
      <TimerDisplay
        timeLeft={timeLeft}
        mode={mode}
        progress={progress}
        totalTime={totalTime}
        lang={lang}
      />

      {/* 完成计数 */}
      <div className="text-slate-500 text-sm flex items-center gap-1">
        <span>🍅</span>
        <span>{pomodoroCount}</span>
      </div>

      {/* 控制按钮 */}
      <ControlButtons
        isRunning={isRunning}
        onStart={start}
        onPause={pause}
        onReset={reset}
        lang={lang}
      />

      {/* 模态面板 */}
      {showSettings && (
        <SettingsPanel
          workDuration={settings.workDuration}
          breakDuration={settings.breakDuration}
          longBreakDuration={settings.longBreakDuration}
          longBreakInterval={settings.longBreakInterval}
          lang={lang}
          onChange={(key, value) => updateSettings({ [key]: value })}
          onToggleLang={toggleLang}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showStats && (
        <StatsPanel
          history={JSON.parse(localStorage.getItem('pomodoro-history') || '[]')}
          lang={lang}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  )
}
