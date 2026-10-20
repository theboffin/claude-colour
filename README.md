# colour

A Claude Code plugin for the desktop app that colour-codes sessions in the sidebar by putting a coloured emoji at the start of the session's title.

| Type | Title becomes |
|---|---|
| `/colour green` or `/colour green round` | 🟢 My session |
| `/colour green square` | 🟩 My session |
| `/colour green heart` | 💚 My session |
| `/colour pink` | 🩷 My session |
| `/colour rainbow` | 🌈 My session |
| `/colour random` | a random circle, square or heart |
| `/colour none` | My session |
| `/colour` | lists every colour |

Colours: red, orange, yellow, green, blue, purple, brown, black and white, each round, square or heart. Hearts also come in pink and grey; pink needs no shape named, and grey as a circle or square gives black. `/color` and `gray` work too. Sessions are never coloured unless you ask.

The desktop app may ask you to approve the rename the first time, for a title you set yourself. In a terminal session, `/colour` says it needs the desktop app.

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

The command is in `hooks/register.ts`, the colours in `hooks/colours.ts`, tests in `hooks/colour.test.ts`.

```
claude plugin validate .
claude plugin test .
```
