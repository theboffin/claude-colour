export const ROUND: Record<string, string> = {
  red: '🔴', orange: '🟠', yellow: '🟡', green: '🟢', blue: '🔵',
  purple: '🟣', brown: '🟤', black: '⚫', white: '⚪',
}

export const SQUARE: Record<string, string> = {
  red: '🟥', orange: '🟧', yellow: '🟨', green: '🟩', blue: '🟦',
  purple: '🟪', brown: '🟫', black: '⬛', white: '⬜',
}

// Hearts add the colours circles and squares lack: pink, and a true grey.
export const HEART: Record<string, string> = {
  red: '❤️', orange: '🧡', yellow: '💛', green: '💚', blue: '💙',
  purple: '💜', brown: '🤎', black: '🖤', white: '🤍', pink: '🩷', grey: '🩶',
}

export const RAINBOW = '🌈'

// /colour emoji-<name>: markers that aren't colours. Windows draws all of
// these (it has no country flags, which is why there are none).
export const EMOJI: Record<string, string> = {
  guard: '💂', teapot: '🫖', crown: '👑', kangaroo: '🦘', koala: '🐨',
  liberty: '🗽', eagle: '🦅', bridge: '🌉', telephone: '☎️', clock: '🕰️',
  smiley: '🙂', frown: '🙁', grin: '😁', 'arms-up': '🙌', laugh: '😂',
  wink: '😉', cool: '😎', think: '🤔', sad: '😢', 'thumbs-up': '👍',
  star: '⭐', fire: '🔥', rocket: '🚀', bug: '🐛', tick: '✅', cross: '❌',
  warning: '⚠️', lock: '🔒', coffee: '☕', party: '🎉',
}

// Other spellings people reach for.
const EMOJI_ALIASES: Record<string, string> = {
  kangeroo: 'kangaroo', phone: 'telephone', smile: 'smiley', frowning: 'frown',
  thumbsup: 'thumbs-up', armsup: 'arms-up', check: 'tick', tea: 'teapot',
}

// Every emoji this mod puts at the start of a title, so a new choice
// replaces the old one rather than stacking. Longest first: '❤️' and '☎️'
// carry a variation selector, and must match whole before their bare form.
const MARKS = [
  ...Object.values(HEART), ...Object.values(ROUND), ...Object.values(SQUARE),
  ...Object.values(EMOJI), RAINBOW,
].sort((a, b) => b.length - a.length)

const EMOJI_LIST = Object.entries(EMOJI).map(([n, m]) => `${m} ${n}`).join('  ')

export const USAGE = [
  'Usage: /colour <colour> [round|square|heart], /colour emoji-<name>, /colour rainbow, /colour random, /colour none',
  `Round:  ${Object.entries(ROUND).map(([n, m]) => `${m} ${n}`).join('  ')}`,
  `Square: ${Object.entries(SQUARE).map(([n, m]) => `${m} ${n}`).join('  ')}`,
  `Heart:  ${Object.entries(HEART).map(([n, m]) => `${m} ${n}`).join('  ')}`,
  `Also:   ${RAINBOW} rainbow`,
].join('\n')

export type Parsed = { mark: string } | { error: string } | { usage: true }

// '' is "no colour". `pick` chooses for `random` (an index into every mark).
export const parse = (args: string, pick: (n: number) => number = n => Math.floor(Math.random() * n)): Parsed => {
  const words = args.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) {
    return { usage: true }
  }
  const [named = '', given, ...rest] = words
  const colour = named === 'gray' ? 'grey' : named
  // Pink comes only as a heart, so it needs no shape named.
  const shape = given ?? (colour === 'pink' ? 'heart' : 'round')
  if (rest.length > 0) {
    return { error: `Too many words: "${args.trim()}".` }
  }
  // emoji-<name>, or emoji <name>.
  if (colour === 'emoji' || colour.startsWith('emoji-')) {
    const typed = colour === 'emoji' ? given : colour.slice('emoji-'.length)
    if (typed === undefined || typed === '') {
      return { error: `Name one: /colour emoji-<name>.
Emoji: ${EMOJI_LIST}` }
    }
    const mark = EMOJI[EMOJI_ALIASES[typed] ?? typed]
    if (mark === undefined) {
      return { error: `There's no "${typed}" emoji here.
Emoji: ${EMOJI_LIST}` }
    }
    return { mark }
  }
  if (colour === 'none' || colour === 'off' || colour === 'clear') {
    return { mark: '' }
  }
  if (colour === 'rainbow') {
    return { mark: RAINBOW }
  }
  if (colour === 'random') {
    const all = [...Object.values(ROUND), ...Object.values(SQUARE), ...Object.values(HEART)]
    return { mark: all[pick(all.length)] ?? RAINBOW }
  }
  const table =
    shape === 'round' || shape === 'circle' ? ROUND
    : shape === 'square' ? SQUARE
    : shape === 'heart' ? HEART
    : undefined
  if (table === undefined) {
    return { error: `"${shape}" isn't a shape: use round, square or heart.` }
  }
  // Circles and squares have no grey; black is the nearest.
  const mark = table[colour] ?? (colour === 'grey' ? table.black : undefined)
  if (mark === undefined) {
    return {
      error: HEART[colour] !== undefined
        ? `${colour} comes only as a heart: /colour ${colour} heart.`
        : `"${colour}" isn't one of the colours.`,
    }
  }

  return { mark }
}

// The title with `mark` in front ('' strips it), every earlier mark replaced.
export const withMark = (title: string, mark: string): string => {
  let base = title.trimStart()
  for (let old = MARKS.find(m => base.startsWith(m)); old !== undefined; old = MARKS.find(m => base.startsWith(m))) {
    base = base.slice(old.length).trimStart()
  }

  return mark === '' ? base : `${mark} ${base}`
}
