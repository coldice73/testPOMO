import type { PomodoroRecord, HistoryStats, Lang } from '../types'
import { t } from '../i18n'
import { formatTime } from '../utils'

interface StatsPanelProps {
  history: PomodoroRecord[]
  lang: Lang
  onClose: () => void
}

export function StatsPanel({ history, lang, onClose }: StatsPanelProps) {
  const stats = computeStats(history)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl p-6 w-[400px] max-w-[90vw] max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-100">{t('stats.title', lang)}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label={t('stats.total', lang)} value={String(stats.totalPomodoros)} />
          <StatCard label={t('stats.totalMinutes', lang)} value={String(stats.totalWorkMinutes)} />
          <StatCard label={t('stats.today', lang)} value={String(stats.todayPomodoros)} />
          <StatCard label={t('stats.todayMinutes', lang)} value={String(stats.todayWorkMinutes)} />
        </div>

        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
          {t('stats.history', lang)}
        </h3>

        {history.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">{t('stats.empty', lang)}</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 20).map(record => (
              <div
                key={record.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-700/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm truncate">
                    {record.task || '🍅 Pomodoro'}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {new Date(record.timestamp).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className="text-slate-400 text-sm font-mono ml-2 shrink-0">
                  {formatTime(record.duration)}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-indigo-500 text-white font-semibold hover:brightness-90 transition-all active:scale-[0.97]"
        >
          {t('settings.close', lang)}
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-700/50 rounded-xl p-3 text-center">
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  )
}

function computeStats(history: PomodoroRecord[]): HistoryStats {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayTs = todayStart.getTime()

  const today = history.filter(r => r.timestamp >= todayTs)

  return {
    totalPomodoros: history.length,
    totalWorkMinutes: Math.round(history.reduce((sum, r) => sum + r.duration, 0) / 60),
    todayPomodoros: today.length,
    todayWorkMinutes: Math.round(today.reduce((sum, r) => sum + r.duration, 0) / 60),
  }
}
