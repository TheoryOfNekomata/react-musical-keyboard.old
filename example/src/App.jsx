import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Midi, } from '@tonejs/midi'

import MusicalKeyboard from 'react-musical-keyboard'

import getKeyFrequency from './services/getKeyFrequency'

const PITCH_NAMES = 'C C# D D# E F F# G G# A A# B'.split(' ')

const App = ({
  startKey: startKeyProp = 21,
  endKey: endKeyProp = 108,
  sound: soundProp = 0,
  generator = null,
  keyboardMapping = {},
}) => {
  const [withLabels, ] = React.useState(false)
  const [sound, setSound, ] = React.useState(soundProp)
  const [sustain, setSustain, ] = React.useState(false)
  const [sostenuto, setSostenuto, ] = React.useState(false)
  const [unaCorda, setUnaCorda, ] = React.useState(false)
  const [notesOn, setNotesOn, ] = React.useState([])
  const [innerWidth, setInnerWidth, ] = React.useState(window.innerWidth)
  const [innerHeight, setInnerHeight, ] = React.useState(window.innerHeight)
  const [, setMouseNotesOn, ] = React.useState([])
  const [, setVelocity, ] = React.useState(null)
  const timer = React.useRef(null)

  const soundRef = React.useRef(null)
  const sustainPedalRef = React.useRef(null)
  const sostenutoPedalRef = React.useRef(null)
  const unaCordaPedalRef = React.useRef(null)
  const keyboardRef = React.useRef(null)

  const keepFocus = () => {
    window.setTimeout(() => {
      const { current = null, } = keyboardRef
      if (current !== null) {
        current.focus()
      }
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
  }, [sustain, generator, ])

  React.useEffect(() => {
    if ('sendMessage' in generator) {
      generator.sendMessage(66, sostenuto)
    }
  }, [sostenuto, generator, ])

  React.useEffect(() => {
    if ('sendMessage' in generator) {
      generator.sendMessage(67, unaCorda)
    }
  }, [unaCorda, generator, ])

  React.useEffect(() => {
    generator.changeSound(sound)
    soundRef.current.value = sound
  }, [sound, generator, ])

  React.useEffect(() => {
    keepFocus()
  }, [])

  React.useEffect(() => {
    const handleDragOver = e => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDrop = async e => {
      e.preventDefault()
      e.stopPropagation()

      const { files, } = e.dataTransfer
      const [file, ] = files

      if (timer.current !== null) {
        window.clearInterval(timer.current)
        if ('sendMessage' in generator) {
          generator.sendMessage(120, 0)
          generator.sendMessage(121, 0)
          setNotesOn([])
        }
      }

      if (file.type !== 'audio/mid') {
        return
      }

      const midiData = await file.arrayBuffer()
      const midi = new Midi(midiData)
      console.log(midi)
      const allMessages = [
        ...midi.tracks.reduce(
          (trackMessages, t, trackNumber) => [
            ...trackMessages,
            ...t.notes.map(n => [
              [
                n.ticks,
                trackNumber,
                'noteOn',
                n.midi,
                n.velocity
              ],
              [
                n.ticks + n.durationTicks,
                trackNumber,
                'noteOff',
                n.midi,
                n.velocity,
              ]
            ]),
            (
              Object.keys(t.controlChanges)
                .map(c => Number(c))
                .filter(c => ![7, 10].includes(c))
                .reduce(
                  (controlChanges, c) => [
                    ...controlChanges,
                    ...t.controlChanges[c].map(d => [
                      d.ticks,
                      trackNumber,
                      c,
                      d.value
                    ])
                  ],
                  []
                )
            )
          ],
          [],
        )
      ]
        .reduce(
          (allTheMessages, m) => [
            ...allTheMessages,
            ...m,
          ],
          []
        )
        .sort((a, b) => a[0] - b[0])

      let ticksCounter = 0
      let queueMessages = allMessages
      timer.current = window.setInterval(() => {
        ticksCounter += midi.header.ppq / 96
        const playMessages = queueMessages.filter(m => m[0] <= ticksCounter)
        playMessages.forEach(m => {
          const [, , type, ...params] = m

          switch (type) {
            case 'noteOn':
              generator.soundOn(
                params[0],
                params[1] * 0x7f,
                getKeyFrequency(params[0], 69, 440)
              )
              setNotesOn(notes => [
                ...notes,
                params[0],
              ])
              break
            case 'noteOff':
              generator.soundOff(
                params[0]
              )
              setNotesOn(notes => notes.filter(n => n !== params[0]))
              break
            default:
              if ('sendMessage' in generator) {
                generator.sendMessage(type, params[0])
              }
              break
          }
        })
        queueMessages = allMessages.filter(m => m[0] > ticksCounter)
        if (ticksCounter > midi.durationTicks) {
          window.clearInterval(timer)
          if ('sendMessage' in generator) {
            generator.sendMessage(120, 0)
            generator.sendMessage(121, 0)
            setNotesOn([])
          }
        }
      })
    }

    const handleResize = e => {
      const { innerWidth, innerHeight, } = e.target

      setInnerWidth(innerWidth)
      setInnerHeight(innerHeight)
    }

    window.document.body.addEventListener('dragover', handleDragOver)
    window.document.body.addEventListener('drop', handleDrop)
    window.addEventListener('resize', handleResize)
    return () => {
      window.document.body.removeEventListener('dragover', handleDragOver)
      window.document.body.removeEventListener('drop', handleDrop)
      window.removeEventListener('resize', handleResize)
    }
  }, [generator, ])

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
      <MusicalKeyboard
        ref={keyboardRef}
        labels={key => withLabels ? `${PITCH_NAMES[key.id % 12]}${Math.floor(key.id / 12) - 1}` : null}
        onKeyOn={handleKeyOn}
        onKeyOff={handleKeyOff}
        startKey={startKeyProp}
        endKey={endKeyProp}
        accidentalKeyHeight="65%"
        keyboardMapping={keyboardMapping}
        orientation={innerWidth < innerHeight ? 'rotate-90' : 'normal'}
        style={{
          height: innerWidth < innerHeight ? '100%' : '5vw',
          width: innerWidth < innerHeight ? '5vh' : '100%',
          color: '#000',
          outline: 'none',
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
        naturalKeyStyle={pressed => ({
          backgroundColor: pressed ? 'Highlight' : 'white',
          border: '1px solid',
        })}
        accidentalKeyStyle={pressed => ({
          backgroundColor: pressed ? 'Highlight' : 'currentColor',
          border: '1px solid',
        })}
        keysOn={notesOn}
      />
    </React.Fragment>
  )
}

App.propTypes = {
  startKey: PropTypes.number,
  endKey: PropTypes.number,
  sound: PropTypes.number,
  generator: PropTypes.object,
  keyboardMapping: PropTypes.object,
}

export default App
