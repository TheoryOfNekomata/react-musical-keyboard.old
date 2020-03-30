import * as React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import App from './App'

const KEYBOARD_MAPPING = {
  81: 60,
  50: '61a',
  87: 62,
  51: '63a',
  69: 64,
  82: 65,
  53: '66a',
  84: 67,
  54: '68a',
  89: 69,
  55: '70a',
  85: 71,
  73: 72,
  57: '73a',
  79: 74,
  48: '75a',
  80: 76,
  219: 77,
  61: '78a',
  187: '78a',
  221: 79,
  90: 48,
  83: '49a',
  88: 50,
  68: '51a',
  67: 52,
  86: 53,
  71: '54a',
  66: 55,
  72: '56a',
  78: 57,
  74: '58a',
  77: 59,
  188: 60,
  76: '61a',
  190: 62,
  59: '63a',
  186: 63,
  191: 64,
}

Promise.all([
  import('./services/MidiSoundGenerator'),
  import('./services/WaveSoundGenerator')
])
  .then(([midiModule, waveModule, ]) => {
    let Generator = waveModule.default(440)
    if ('requestMIDIAccess' in window.navigator) {
      Generator = midiModule.default
    }

    ReactDOM.render(
      React.createElement(App, {
        generator: new Generator(),
        keyboardMapping: KEYBOARD_MAPPING,
        startKey: 0,
        endKey: 127,
      }),
      window.document.getElementById('root')
    )
  })
