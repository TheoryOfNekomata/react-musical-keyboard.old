import * as React from 'react'
import * as PropTypes from 'prop-types'

import MusicalKeyboard from 'react-musical-keyboard'

import getKeyFrequency from './services/getKeyFrequency'

const PITCH_NAMES = 'C C# D D# E F F# G G# A A# B'.split(' ')

const App = ({
  startKey: startKeyProp = 21,
  endKey: endKeyProp = 108,
  sound: soundProp = 0,
  sounds = [],
  generator = null,
  keyboardMapping = {},
}) => {
  const [withLabels, setWithLabels, ] = React.useState(false)
  const [sound, setSound, ] = React.useState(soundProp)
  const [sustain, setSustain, ] = React.useState(false)
  const [sostenuto, setSostenuto, ] = React.useState(false)
  const [unaCorda, setUnaCorda, ] = React.useState(false)

  const soundRef = React.useRef(null)
  const sustainPedalRef = React.useRef(null)
  const sostenutoPedalRef = React.useRef(null)
  const unaCordaPedalRef = React.useRef(null)
  const keyboardRef = React.useRef(null)

  const handleSoundChange = e => {
    const { value, } = e.target
    setSound(value)
    generator.changeSound(value)
    keyboardRef.current.focus()
  }

  const handleSustainPedalChange = e => {
    const { value, checked, } = e.target
    const ccValue = checked ? value : 0
    setSustain(ccValue)
    generator.sendMessage(64, ccValue)
    keyboardRef.current.focus()
  }

  const handleSostenutoPedalChange = e => {
    const { value, checked, } = e.target
    const ccValue = checked ? value : 0
    setSostenuto(ccValue)
    generator.sendMessage(66, ccValue)
    keyboardRef.current.focus()
  }

  const handleUnaCordaPedalChange = e => {
    const { value, checked, } = e.target
    const ccValue = checked ? value : 0
    setUnaCorda(ccValue)
    generator.sendMessage(67, ccValue)
    keyboardRef.current.focus()
  }

  const handleKeyOn = e => {
    const { value, } = e.target
    const { id: noteId, velocity: noteVelocity, } = value
    generator.soundOn(
      noteId,
      noteVelocity * 0x7f,
      getKeyFrequency(noteId, 69, 440),
    )
  }

  const handleKeyOff = e => {
    const { id: noteId, } = e.target.value
    generator.soundOff(noteId)
  }

  const keepFocus = () => {
    keyboardRef.current.focus()
  }

  React.useEffect(() => {
    soundRef.current.value = sound
    sustainPedalRef.current.checked = sustain > 0
    sostenutoPedalRef.current.checked = sostenuto > 0
    unaCordaPedalRef.current.checked = unaCorda > 0
  }, [sound, sustain, sostenuto, unaCorda ])

  React.useEffect(() => {
    window.document.body.addEventListener('focus', keepFocus)
    return () => {
      window.document.body.removeEventListener('focus', keepFocus)
    }
  }, [])

  return (
    <div>
      <form>
        <label className="field">
          <span className="label">Sound</span>
          <select
            className="input"
            name="sound"
            onChange={handleSoundChange}
            ref={soundRef}
          >
            {
              sounds.map((s, i) => (
                <option
                  key={i}
                  value={i}
                >
                  {s}
                </option>
              ))
            }
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            name="una_corda"
            value="127"
            ref={unaCordaPedalRef}
            onChange={handleUnaCordaPedalChange}
          />
          <span>
            Una Corda
          </span>
        </label>
        <label>
          <input
            type="checkbox"
            name="sostenuto"
            value="127"
            ref={sostenutoPedalRef}
            onChange={handleSostenutoPedalChange}
          />
          <span>
            Sostenuto
          </span>
        </label>
        <label>
          <input
            type="checkbox"
            name="sustain"
            value="127"
            ref={sustainPedalRef}
            onChange={handleSustainPedalChange}
          />
          <span>
            Sustain
          </span>
        </label>
      </form>
      <MusicalKeyboard
        ref={keyboardRef}
        className="keyboard"
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
        startKey={startKeyProp}
        endKey={endKeyProp}
        blackKeyHeight="65%"
        keyboardMapping={keyboardMapping}
        whiteKeyColor="white"
        blackKeyColor="black"
      />
    </div>
  )
}

App.propTypes = {
  startKey: PropTypes.number,
  endKey: PropTypes.number,
  sound: PropTypes.number,
  sounds: PropTypes.arrayOf(PropTypes.number),
  generator: PropTypes.object,
  keyboardMapping: PropTypes.object,
}

export default App
