# react-musical-keyboard

Musical keyboard component for React.

`react-musical-keyboard` is inspired by the UI/UX of keyboards on FL Studio's piano roll.

[![NPM](https://img.shields.io/npm/v/react-musical-keyboard.svg)](https://www.npmjs.com/package/react-musical-keyboard) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-musical-keyboard
```

## Usage

```jsx
import React from 'react'

import MusicalKeyboard from 'react-musical-keyboard'

const KEYBOARD_MAPPING = {
    // key code to note ID mapping
    81: 60,
    50: 61,
    87: 62,
    51: 63,
    69: 64,
    82: 65,
    53: 66,
    84: 67,
    // ...
}

const App = () => {
  handleKeyOn = ({ value: { id, velocity } }) => {
    // ...maybe use the Web Audio/MIDI API to generate sounds?
  }

  handleKeyOff = ({ value: { id } }) => {
    // ...
  }

  return (
    <MusicalKeyboard
      style={{
        height: '8vw',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
      }}
      labels={key => withLabels ? `${PITCH_NAMES[key.id % 12]}${Math.floor(key.id / 12) - 1}` : null}
      onKeyOn={handleKeyOn}
      onKeyOff={handleKeyOff}
      startKey={0 /* C0 in MIDI, Middle C (C5) is 60 */}
      endKey={127 /* G10 in MIDI */}
      accidentalKeyHeight={'65%' /* percentage value, relative to white key height */}
      keyboardMapping={KEYBOARD_MAPPING}
      naturalKeyColor={'white' /* any CSS color, applies to all white keys */}
      accidentalKeyColor={'black' /* any CSS color, applies to all black keys */}
    />
  )
```

## License

MIT © [Temoto-kun](https://github.com/Temoto-kun)
