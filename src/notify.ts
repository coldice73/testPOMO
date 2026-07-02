const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

function playBeep(frequency: number, duration: number, type: OscillatorType = 'sine') {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = type
  osc.frequency.value = frequency
  gain.gain.value = 0.3
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start()
  osc.stop(audioCtx.currentTime + duration)
}

export function playNotification() {
  // 播放三音提示
  playBeep(880, 0.15, 'sine')
  setTimeout(() => playBeep(1100, 0.15, 'sine'), 150)
  setTimeout(() => playBeep(1320, 0.25, 'sine'), 300)
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

export function sendBrowserNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.svg' })
  }
}
