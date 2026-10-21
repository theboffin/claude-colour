# colour

A Claude Code plugin for the desktop app that marks sessions in the sidebar with a coloured shape or an emoji at the start of the session's title, so you can tell them apart at a glance.

```
🟢 GDLW-1304 last recheck date
🟥 Prod incident triage
🦘 Australian testbench
```

Sessions are never marked unless you ask.

## Use

| Type | Title becomes |
|---|---|
| `/colour green` or `/colour green round` | 🟢 My session |
| `/colour green square` | 🟩 My session |
| `/colour green heart` | 💚 My session |
| `/colour pink` | 🩷 My session |
| `/colour rainbow` | 🌈 My session |
| `/colour emoji-kangaroo` | 🦘 My session |
| `/colour random` | a random circle, square or heart |
| `/colour none` | My session |
| `/colour` | lists everything below |

A new choice replaces the old one rather than adding a second. `/color` works too.

## Colours

| Shape | Colours |
|---|---|
| Round (the default) | 🔴 red, 🟠 orange, 🟡 yellow, 🟢 green, 🔵 blue, 🟣 purple, 🟤 brown, ⚫ black, ⚪ white |
| Square | 🟥 red, 🟧 orange, 🟨 yellow, 🟩 green, 🟦 blue, 🟪 purple, 🟫 brown, ⬛ black, ⬜ white |
| Heart | ❤️ red, 🧡 orange, 💛 yellow, 💚 green, 💙 blue, 💜 purple, 🤎 brown, 🖤 black, 🤍 white, 🩷 pink, 🩶 grey |

Pink comes only as a heart, so `/colour pink` needs no shape. Grey as a circle or square gives black. `gray` works too.

## Emoji

Type `/colour emoji-<name>` (or `/colour emoji <name>`):

| Group | Names |
|---|---|
| Places and things | 💂 guard, 🫖 teapot, 👑 crown, 🦘 kangaroo, 🐨 koala, 🗽 liberty, 🦅 eagle, 🌉 bridge, ☎️ telephone, 🕰️ clock |
| Faces | 🙂 smiley, 🙁 frown, 😁 grin, 🙌 arms-up, 😂 laugh, 😉 wink, 😎 cool, 🤔 think, 😢 sad, 👍 thumbs-up |
| Markers | ⭐ star, 🔥 fire, 🚀 rocket, 🐛 bug, ✅ tick, ❌ cross, ⚠️ warning, 🔒 lock, ☕ coffee, 🎉 party |

A few other spellings work too: `kangeroo`, `phone`, `smile`, `tea`, `check`, `thumbsup`. `/colour random` picks only colours, never emoji.

There are no country flags. Windows' emoji font has none, so the desktop app shows them as letters (🇬🇧 as "GB").

## Notes

- Desktop app only. In a terminal session, `/colour` says so and changes nothing.
- The plugin renames the session through the desktop app. The app may ask you to approve the rename the first time, for a title you set yourself.
- If you rename a session yourself and drop the marker, it stays off until you run `/colour` again.

## Install

At the prompt of a terminal Claude Code session:

```
/plugin install colour --marketplace theboffin/claude-colour
```

Answer `y` to add the marketplace, then pick the user scope so it loads in every session, including the desktop app's.

## Turn it off

```
claude plugin disable colour@bdukes-colour
```

## Develop

The command is in `hooks/register.ts`, the colours and emoji in `hooks/colours.ts`, and the tests in `hooks/colour.test.ts`.

```
claude plugin validate .
claude plugin test .
```
