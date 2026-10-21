import { expect, test } from 'claude-code/testing'
import type { On } from 'claude-code'

import { parse, withMark } from './colours'

test('parses colours, shapes and the extras', () => {
  expect(parse('green')).toEqual({ mark: '🟢' })
  expect(parse('Green Round')).toEqual({ mark: '🟢' })
  expect(parse('green square')).toEqual({ mark: '🟩' })
  expect(parse('grey square')).toEqual({ mark: '⬛' })
  expect(parse('rainbow')).toEqual({ mark: '🌈' })
  expect(parse('none')).toEqual({ mark: '' })
  expect(parse('random', () => 9)).toEqual({ mark: '🟥' })
  expect(parse('random', () => 18)).toEqual({ mark: '❤️' })
  expect(parse('pink')).toEqual({ mark: '🩷' })
  expect(parse('pink heart')).toEqual({ mark: '🩷' })
  expect(parse('red heart')).toEqual({ mark: '❤️' })
  expect(parse('grey heart')).toEqual({ mark: '🩶' })
  expect(parse('gray')).toEqual({ mark: '⚫' })
  expect(parse('pink square')).toEqual({ error: 'pink comes only as a heart: /colour pink heart.' })
  expect(parse('emoji-kangaroo')).toEqual({ mark: '🦘' })
  expect(parse('emoji-kangeroo')).toEqual({ mark: '🦘' })
  expect(parse('emoji arms-up')).toEqual({ mark: '🙌' })
  expect(parse('Emoji-Liberty')).toEqual({ mark: '🗽' })
  expect(parse('emoji-telephone')).toEqual({ mark: '☎️' })
  expect('error' in parse('emoji-unicorn')).toBe(true)
  expect('error' in parse('emoji')).toBe(true)
  expect(parse('')).toEqual({ usage: true })
  expect('error' in parse('teal')).toBe(true)
  expect('error' in parse('green hexagon')).toBe(true)
})

test('puts the mark in front, replacing any earlier one', () => {
  expect(withMark("Claude MOD's", '🔵')).toBe("🔵 Claude MOD's")
  expect(withMark("🔵 Claude MOD's", '🟩')).toBe("🟩 Claude MOD's")
  expect(withMark("🌈 Claude MOD's", '')).toBe("Claude MOD's")
  expect(withMark("Claude MOD's", '')).toBe("Claude MOD's")
  expect(withMark("❤️ Claude MOD's", '🩷')).toBe("🩷 Claude MOD's")
  expect(withMark("🩷 Claude MOD's", '')).toBe("Claude MOD's")
  expect(withMark("☎️ Claude MOD's", '🦘')).toBe("🦘 Claude MOD's")
  expect(withMark("🦘 Claude MOD's", '🟢')).toBe("🟢 Claude MOD's")
  expect(withMark("⭐ 🫖👑🦘 ☎️🕰️🙌 Claude MOD's", '⭐')).toBe("⭐ Claude MOD's")
  expect(withMark("🌈🩷 Claude MOD's", '')).toBe("Claude MOD's")
})

// Stands in for the desktop app's session tools.
const fakeApp = (on: On, start: string) => {
  const app = { title: start }
  on('mcp.call', (_$, e) => {
    const args = (e.args ?? {}) as { title?: string }
    if (e.tool === 'set_session_title' && args.title !== undefined) {
      app.title = args.title
    }

    return { value: { content: [{ type: 'text' as const, text: JSON.stringify({ title: app.title }) }] } }
  })

  return app
}

test('/colour renames the session at once', async ($, on) => {
  const app = fakeApp(on, "🔵 Claude MOD's")
  expect((await $.command.run({ command: 'colour', args: 'rainbow' })).text).toBe('This session is now 🌈.')
  expect(app.title).toBe("🌈 Claude MOD's")
  await $.command.run({ command: 'colour', args: 'green square' })
  expect(app.title).toBe("🟩 Claude MOD's")
  expect((await $.command.run({ command: 'colour', args: 'none' })).text).toBe('Colour removed from this session.')
  expect(app.title).toBe("Claude MOD's")
  expect((await $.command.run({ command: 'colour', args: '' })).text).toMatch(/^Usage: /)
})
