import type { Lang } from '../types'
import { t } from '../i18n'

interface SettingsPanelProps {
  workDuration: number
  breakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  lang: Lang
  onChange: (key: string, value: number) => void
  onToggleLang: () => void
  onClose: () => void
}

export function SettingsPanel({
  workDuration,
  breakDuration,
  longBreakDuration,
  longBreakInterval,
  lang,
  onChange,
  onToggleLang,
  onClose,
}: SettingsPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl p-6 w-[360px] max-w-[90vw] shadow-2xl border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-100">{t('settings.title', lang)}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <SettingRow
            label={t('settings.work', lang)}
            value={workDuration}
            min={1}
            max={120}
            onChange={v => onChange('workDuration', v)}
          />
          <SettingRow
            label={t('settings.break', lang)}
            value={breakDuration}
            min={1}
            max={30}
            onChange={v => onChange('breakDuration', v)}
          />
          <SettingRow
            label={t('settings.longBreak', lang)}
            value={longBreakDuration}
            min={1}
            max={60}
            onChange={v => onChange('longBreakDuration', v)}
          />
          <SettingRow
            label={t('settings.interval', lang)}
            value={longBreakInterval}
            min={1}
            max={10}
            onChange={v => onChange('longBreakInterval', v)}
          />
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
          <span className="text-slate-300 text-sm">{t('lang.label', lang)}</span>
          <button
            onClick={onToggleLang}
            className="px-4 py-1.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors text-sm font-medium"
          >
            {lang === 'zh' ? 'English' : '中文'}
          </button>
        </div>

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

function SettingRow({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-300 text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-lg"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={e => {
            const v = parseInt(e.target.value, 10)
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)))
          }}
          className="w-14 h-8 text-center rounded-lg bg-slate-700 text-slate-100 border border-slate-600 focus:border-indigo-400 focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-lg"
        >
          +
        </button>
      </div>
    </div>
  )
}
