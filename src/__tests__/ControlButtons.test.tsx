import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ControlButtons } from '../components/ControlButtons'

describe('ControlButtons', () => {
  afterEach(() => {
    cleanup()
  })
  it('isRunning=false → 显示"开始"按钮和"重置"按钮', () => {
    render(
      <ControlButtons
        isRunning={false}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    )
    expect(screen.getByText('开始')).toBeInTheDocument()
    expect(screen.getByText('重置')).toBeInTheDocument()
    expect(screen.queryByText('暂停')).not.toBeInTheDocument()
  })

  it('isRunning=true → 显示"暂停"按钮和"重置"按钮', () => {
    render(
      <ControlButtons
        isRunning={true}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    )
    expect(screen.getByText('暂停')).toBeInTheDocument()
    expect(screen.getByText('重置')).toBeInTheDocument()
    expect(screen.queryByText('开始')).not.toBeInTheDocument()
  })

  it('点击"开始" → 调用 onStart', async () => {
    const onStart = vi.fn()
    render(
      <ControlButtons
        isRunning={false}
        onStart={onStart}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    )
    await userEvent.click(screen.getByText('开始'))
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('点击"暂停" → 调用 onPause', async () => {
    const onPause = vi.fn()
    render(
      <ControlButtons
        isRunning={true}
        onStart={vi.fn()}
        onPause={onPause}
        onReset={vi.fn()}
      />
    )
    await userEvent.click(screen.getByText('暂停'))
    expect(onPause).toHaveBeenCalledTimes(1)
  })

  it('点击"重置" → 调用 onReset', async () => {
    const onReset = vi.fn()
    render(
      <ControlButtons
        isRunning={false}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={onReset}
      />
    )
    await userEvent.click(screen.getByText('重置'))
    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
