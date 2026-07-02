import type { Lang } from './types'

const zh: Record<string, string> = {
  'app.title': '番茄钟',
  'mode.work': '🍅 工作时间',
  'mode.break': '☕ 休息时间',
  'mode.longBreak': '🍵 长休息',
  'title.work': '🍅 工作',
  'title.break': '☕ 休息',
  'title.longBreak': '🍵 长休息',
  'btn.start': '开始',
  'btn.pause': '暂停',
  'btn.reset': '重置',
  'settings.title': '设置',
  'settings.work': '工作时长（分）',
  'settings.break': '短休息（分）',
  'settings.longBreak': '长休息（分）',
  'settings.interval': '长休息间隔（次）',
  'settings.close': '关闭',
  'task.placeholder': '我正在做什么...',
  'stats.title': '统计',
  'stats.total': '总番茄数',
  'stats.totalMinutes': '总工作分钟',
  'stats.today': '今日番茄',
  'stats.todayMinutes': '今日工作分钟',
  'stats.history': '历史记录',
  'stats.empty': '暂无记录',
  'notify.workDone': '工作时间结束！休息一下吧 ☕',
  'notify.breakDone': '休息时间结束！开始工作吧 🍅',
  'notify.longBreakDone': '长休息结束！开始工作吧 🍅',
  'lang.label': '语言',
}

const en: Record<string, string> = {
  'app.title': 'Pomodoro',
  'mode.work': '🍅 Focus Time',
  'mode.break': '☕ Break Time',
  'mode.longBreak': '🍵 Long Break',
  'title.work': '🍅 Work',
  'title.break': '☕ Break',
  'title.longBreak': '🍵 Long Break',
  'btn.start': 'Start',
  'btn.pause': 'Pause',
  'btn.reset': 'Reset',
  'settings.title': 'Settings',
  'settings.work': 'Work (min)',
  'settings.break': 'Short Break (min)',
  'settings.longBreak': 'Long Break (min)',
  'settings.interval': 'Long Break Interval',
  'settings.close': 'Close',
  'task.placeholder': 'What are you working on?',
  'stats.title': 'Statistics',
  'stats.total': 'Total Pomodoros',
  'stats.totalMinutes': 'Total Work Minutes',
  'stats.today': 'Today',
  'stats.todayMinutes': 'Today Minutes',
  'stats.history': 'History',
  'stats.empty': 'No records yet',
  'notify.workDone': 'Focus time is up! Take a break ☕',
  'notify.breakDone': 'Break is over! Back to work 🍅',
  'notify.longBreakDone': 'Long break is over! Back to work 🍅',
  'lang.label': 'Language',
}

const dicts: Record<Lang, Record<string, string>> = { zh, en }

export function t(key: string, lang: Lang): string {
  return dicts[lang]?.[key] ?? dicts['zh']?.[key] ?? key
}
