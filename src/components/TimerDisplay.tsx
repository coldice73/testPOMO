import type { TimerMode, Lang } from '../types'
import { ProgressRing } from './ProgressRing'
import { formatTime } from '../utils'
import { t } from '../i18n'

interface TimerDisplayProps {
  timeLeft: number
  mode: TimerMode
  progress: number
  totalTime: number
  lang: Lang
}

const modeLabelKey: Record<TimerMode, string> = {
  work: 'mode.work',
  break: 'mode.break',
  longBreak: 'mode.longBreak',
}

export function TimerDisplay({ timeLeft, mode, progress, totalTime, lang }: TimerDisplayProps) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <ProgressRing progress={progress} mode={mode} size={280} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl md:text-7xl font-bold text-slate-50 tabular-nums leading-none">
          {formatTime(timeLeft)}
        </span>
        <span className="text-xl font-medium text-slate-400 mt-4">
          {t(modeLabelKey[mode], lang)}
        </span>
      </div>
    </div>
  )
}
