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
  const [notesOn, setNotesOn, ] = React.useState([])
  const [mouseNotesOn, setMouseNotesOn, ] = React.useState([])
  const [velocity, setVelocity, ] = React.useState(null)

  const soundRef = React.useRef(null)
  const sustainPedalRef = React.useRef(null)
  const sostenutoPedalRef = React.useRef(null)
  const unaCordaPedalRef = React.useRef(null)
  const keyboardRef = React.useRef(null)

  const keepFocus = () => {
    window.setTimeout(() => {
      keyboardRef.current.focus()
    })
  }

  const handleSoundChange = e => {
    setSound(e.target.value)
    keepFocus()
  }

  const handleSustainPedalDepress = () => {
    setSustain(127)
    keepFocus()
  }

  const handleSustainPedalRelease = () => {
    setSustain(0)
    keepFocus()
  }

  const handleSostenutoPedalDepress = () => {
    setSostenuto(127)
    keepFocus()
  }

  const handleSostenutoPedalRelease = () => {
    setSostenuto(0)
    keepFocus()
  }

  const handleUnaCordaPedalDepress = () => {
    setUnaCorda(127)
    keepFocus()
  }

  const handleUnaCordaPedalRelease = () => {
    setUnaCorda(0)
    keepFocus()
  }

  const handleKeyOn = e => {
    const { source, } = e
    const { id, velocity, } = e.target.value
    if (source === 'mouse') {
      setMouseNotesOn(notes => [
        ...notes,
        id,
      ])
    }
    setNotesOn(notes => [
      ...notes,
      id,
    ])
    setVelocity(oldVelocity => {
      const theVelocity = oldVelocity !== null ? oldVelocity : velocity
      generator.soundOn(
        id,
        (source === 'mouse' ? theVelocity : velocity) * 0x7f,
        getKeyFrequency(id, 69, 440),
      )
      return source === 'mouse' ? theVelocity : oldVelocity
    })
  }

  const handleKeyOff = e => {
    const { source, } = e
    const { id, } = e.target.value
    setNotesOn(notes => notes.filter(n => n !== id))
    if (source === 'mouse') {
      window.setTimeout(() => {
        setMouseNotesOn(notes => {
          const newNotes = notes.filter(n => n !== id)
          setVelocity(oldVelocity => newNotes.length > 0 ? oldVelocity : null)
          return newNotes
        })
      })
    }
    generator.soundOff(id)
  }

  React.useEffect(() => {
    if ('sendMessage' in generator) {
      generator.sendMessage(64, sustain)
    }
  }, [sustain, ])

  React.useEffect(() => {
    if ('sendMessage' in generator) {
      generator.sendMessage(66, sostenuto)
    }
  }, [sostenuto, ])

  React.useEffect(() => {
    if ('sendMessage' in generator) {
      generator.sendMessage(67, unaCorda)
    }
  }, [unaCorda, ])

  React.useEffect(() => {
    generator.changeSound(sound)
    soundRef.current.value = sound
  }, [sound, ])

  React.useEffect(() => {
    keepFocus()
  }, [])

  return (
    <React.Fragment>
      <div
        className="topbar"
      >
        <div className="group">
          <label className="sound">
            <span className="label">Sound</span>
            <select
              className="input"
              name="sound"
              onChange={handleSoundChange}
              ref={soundRef}
            >
              {
                generator.getSounds().map((s, i) => (
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
        </div>
      </div>
      <div
        style={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
          left: 0,
          borderColor: 'black',
        }}
      >
        {
          'sendMessage' in generator
          && (
            <div
              className="pedals"
            >
              <button
                type="button"
                ref={unaCordaPedalRef}
                onMouseDown={handleUnaCordaPedalDepress}
                onMouseUp={handleUnaCordaPedalRelease}
                onMouseLeave={handleUnaCordaPedalRelease}
              >
                Una Corda
              </button>
              <button
                type="button"
                ref={sostenutoPedalRef}
                onMouseDown={handleSostenutoPedalDepress}
                onMouseUp={handleSostenutoPedalRelease}
                onMouseLeave={handleSostenutoPedalRelease}
              >
                Sostenuto
              </button>
              <button
                type="button"
                ref={sustainPedalRef}
                onMouseDown={handleSustainPedalDepress}
                onMouseUp={handleSustainPedalRelease}
                onMouseLeave={handleSustainPedalRelease}
              >
                Sustain
              </button>
            </div>
          )
        }
        <div
          className="keyboard"
        >
          <MusicalKeyboard
            ref={keyboardRef}
            labels={key => withLabels ? `${PITCH_NAMES[key.id % 12]}${Math.floor(key.id / 12) - 1}` : null}
            onKeyOn={handleKeyOn}
            onKeyOff={handleKeyOff}
            startKey={startKeyProp}
            endKey={endKeyProp}
            accidentalKeyHeight="65%"
            keyboardMapping={keyboardMapping}
            naturalKeyColor="white"
            accidentalKeyColor="black"
            notesOn={notesOn}
          />
        </div>
      </div>
    </React.Fragment>
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
