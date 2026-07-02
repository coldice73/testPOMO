interface ControlButtonsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

const buttonBase =
  'px-8 py-3 text-base font-semibold rounded-xl transition-all duration-150 ' +
  'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ' +
  'active:scale-[0.97]'

export function ControlButtons({ isRunning, onStart, onPause, onReset }: ControlButtonsProps) {
  return (
    <div className="flex gap-4">
      {isRunning ? (
        <button
          onClick={onPause}
          className={`${buttonBase} bg-amber-500 text-white hover:brightness-90`}
        >
          暂停
        </button>
      ) : (
        <button
          onClick={onStart}
          className={`${buttonBase} bg-green-500 text-white hover:brightness-90`}
        >
          开始
        </button>
      )}
      <button
        onClick={onReset}
        className={`${buttonBase} bg-slate-500 text-white hover:brightness-90`}
      >
        重置
      </button>
    </div>
  )
}
