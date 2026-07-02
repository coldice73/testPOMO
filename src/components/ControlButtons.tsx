import type { Lang } from '../types'
import { t } from '../i18n'

interface ControlButtonsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  lang: Lang
}

const buttonBase =
  'px-8 py-3 text-base font-semibold rounded-xl transition-all duration-150 ' +
  'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ' +
  'active:scale-[0.97]'

export function ControlButtons({ isRunning, onStart, onPause, onReset, lang }: ControlButtonsProps) {
  return (
    <div className="flex gap-4">
      {isRunning ? (
        <button
          onClick={onPause}
          className={`${buttonBase} bg-amber-500 text-white hover:brightness-90`}
        >
          {t('btn.pause', lang)}
        </button>
      ) : (
        <button
          onClick={onStart}
          className={`${buttonBase} bg-green-500 text-white hover:brightness-90`}
        >
          {t('btn.start', lang)}
        </button>
      )}
      <button
        onClick={onReset}
        className={`${buttonBase} bg-slate-500 text-white hover:brightness-90`}
      >
        {t('btn.reset', lang)}
      </button>
    </div>
  )
}
