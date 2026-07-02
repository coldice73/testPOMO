# Changelog

## [1.0.0] - 2026-07-02

### Added
- Custom time settings: work/break/long break duration and interval
- Web Audio API sound notification on mode switch
- Browser Notification API for desktop alerts
- History statistics with localStorage persistence
- Long break (15min) after every 4th work session
- Chinese/English i18n support
- Task input field associated with current pomodoro

### Changed
- Pomodoro timer core: work 25min / short break 5min cycle
- SVG circular progress ring with mode-specific colors
- Real-time document title updates with remaining time and mode

### Fixed
- Timer tick logic simplified to always subtract 1 per interval
- Mode duration calculation using ref to avoid stale closure
