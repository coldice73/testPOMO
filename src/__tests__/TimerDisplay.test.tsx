import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { TimerDisplay } from '../components/TimerDisplay'

describe('TimerDisplay', () => {
  afterEach(() => {
    cleanup()
  })
  it('显示格式化时间 25:00', () => {
    render(
      <TimerDisplay timeLeft={1500} mode="work" progress={0} totalTime={1500} />
    )
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('显示格式化时间 05:00', () => {
    render(
      <TimerDisplay timeLeft={300} mode="break" progress={0} totalTime={300} />
    )
    expect(screen.getByText('05:00')).toBeInTheDocument()
  })

  it('显示 00:00', () => {
    render(
      <TimerDisplay timeLeft={0} mode="work" progress={1} totalTime={1500} />
    )
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('工作模式显示 🍅 工作时间', () => {
    render(
      <TimerDisplay timeLeft={1500} mode="work" progress={0} totalTime={1500} />
    )
    expect(screen.getByText('🍅 工作时间')).toBeInTheDocument()
  })

  it('休息模式显示 ☕ 休息时间', () => {
    render(
      <TimerDisplay timeLeft={300} mode="break" progress={0} totalTime={300} />
    )
    expect(screen.getByText('☕ 休息时间')).toBeInTheDocument()
  })

  it('渲染进度环 SVG', () => {
    const { container } = render(
      <TimerDisplay timeLeft={1500} mode="work" progress={0.5} totalTime={1500} />
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
