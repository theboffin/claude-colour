import type { McpToolResult, Register } from 'claude-code'

import { parse, USAGE, withMark } from './colours'

// The desktop app's own session tools: mods can't paint its sidebar, but the
// sidebar shows the session's title, emoji and all, and this renames it.
const SESSIONS = 'ccd_session_mgmt'

const textOf = (result: McpToolResult): string =>
  result.content.map(block => (block.type === 'text' ? block.text : '')).join('')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    for (const name of ['colour', 'color']) {
      await $.command.register({
        name,
        description: 'Colour this session in the sidebar (a coloured emoji before its title)',
        argumentHint: '<colour> [round|square] | rainbow | random | none',
      })
    }

    return next(e)
  })

  on('command.run', async ($, e, next) => {
    if (e.command !== 'colour' && e.command !== 'color') {
      return next(e)
    }
    const parsed = parse(e.args)
    if ('usage' in parsed) {
      return { text: USAGE }
    }
    if ('error' in parsed) {
      return { text: `${parsed.error}\n${USAGE}` }
    }

    let title: string
    try {
      const session = await $.mcp.call(SESSIONS, 'get_session', { session_id: 'self' })
      title = (JSON.parse(textOf(session)) as { title?: string }).title ?? ''
    } catch {
      return { text: "Couldn't read this session's title: /colour works in the Claude desktop app only." }
    }

    const renamed = withMark(title, parsed.mark)
    if (renamed === title) {
      return { text: parsed.mark === '' ? 'This session has no colour.' : `This session is already ${parsed.mark}.` }
    }
    const result = await $.mcp.call(SESSIONS, 'set_session_title', { session_id: 'self', title: renamed })
    if (result.isError === true) {
      return { text: `The rename didn't go through: ${textOf(result)}` }
    }

    return { text: parsed.mark === '' ? 'Colour removed from this session.' : `This session is now ${parsed.mark}.` }
  })
}
