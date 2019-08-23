import * as React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import App from './App'

const KEYBOARD_MAPPING = {
  81: 60,
  50: 61,
  87: 62,
  51: 63,
  69: 64,
  82: 65,
  53: 66,
  84: 67,
  54: 68,
  89: 69,
  55: 70,
  85: 71,
  73: 72,
  57: 73,
  79: 74,
  48: 75,
  80: 76,
  219: 77,
  61: 78,
  187: 78,
  221: 79,
  90: 48,
  83: 49,
  88: 50,
  68: 51,
  67: 52,
  86: 53,
  71: 54,
  66: 55,
  72: 56,
  78: 57,
  74: 58,
  77: 59,
  188: 60,
  76: 61,
  190: 62,
  59: 63,
  186: 63,
  191: 64,
}

Promise.all([
  import('./services/MidiSoundGenerator'),
  import('./services/WaveSoundGenerator')
])
  .then(([midiModule, waveModule, ]) => {
    let Generator = waveModule.default
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
