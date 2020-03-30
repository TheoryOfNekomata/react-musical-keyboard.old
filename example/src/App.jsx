import * as React from 'react'
//import * as PropTypes from 'prop-types'
import MusicalKeyboard from 'react-musical-keyboard'

const defaultInstruments = new Array(16).fill(0)

const handleChannelChange = ({ setActiveChannel, ref, }) => e => {
  const { value, } = e.target
  const { current, } = ref
  setActiveChannel(Number(value))
  current.focus()
}

const handleInstrumentChange = ({ generator, channel: activeChannel, setInstruments, ref, }) => e => {
  const { value, } = e.target
  const { current, } = ref
  const instrumentId = Number(value)
  generator.changeSound(activeChannel)(instrumentId)
  setInstruments(inst => inst.map((i, channel) => channel === activeChannel ? instrumentId : i))
  current.focus()
}

const handleKeyOn = ({ setKeysOn, generator, activeChannel, }) => ({ id, velocity, channel, source, }) => {
  setKeysOn(oldKeysOn => [
    ...oldKeysOn,
    [channel, id, velocity],
  ])
  generator.soundOn(activeChannel)(parseInt(id), velocity * 0x7f)
}

const handleKeyOff = ({ setKeysOn, generator, activeChannel, }) => ({ id, velocity, channel, source, }) => {
  setKeysOn(oldKeysOn => oldKeysOn.filter(([c, i, ]) => !(c === channel || i === id)))
  generator.soundOff(activeChannel)(parseInt(id), velocity * 0x7f)
}

const handlePedalChange = ({ pedal, generator, activeChannel, ref, }) => value => () => {
  generator.sendMessage(activeChannel)(pedal, value)
  const { current, } = ref
  current.focus()
}

const App = ({
  startKey,
  endKey,
  keyboardMapping,
  generator,
}) => {
  const [keysOn, setKeysOn, ] = React.useState([])
  const [activeChannel, setActiveChannel, ] = React.useState(0)
  const [instruments, setInstruments, ] = React.useState(defaultInstruments)
  const [sounds, setSounds, ] = React.useState([])
  const keyboardRef = React.useRef(null)
  const ref = React.useRef(null)

  React.useEffect(() => {
    const tryLock = async () => {
      try {
        return window.screen.orientation.lock('landscape')
      } catch (err) {
        console.log(err)
      }
    }
    tryLock()
  }, [])

  React.useEffect(() => {
    const reScroll = () => {
      keyboardRef.current.scrollLeft = (keyboardRef.current.scrollWidth * 0.4) + (window.innerWidth * 0.4)
    }
    window.addEventListener('resize', reScroll)
    reScroll()
    return () => {
      window.removeEventListener('resize', reScroll)
    }
  }, [])

  React.useEffect(() => {
    setSounds(generator.getSounds())
  }, [generator, ])

  return (
    <React.Fragment>
      <div
        className="keyboard"
        ref={keyboardRef}
      >
        <div>
          <MusicalKeyboard
            ref={ref}
            playable
            keyboardMapping={keyboardMapping}
            startKey={startKey}
            endKey={endKey}
            keysOn={keysOn}
            onKeyOn={handleKeyOn({ setKeysOn, generator, activeChannel, })}
            onKeyOff={handleKeyOff({ setKeysOn, generator, activeChannel, })}
            activeChannel={activeChannel}
            style={{
              main: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                outline: 0,
              },
            }}
          />
        </div>
      </div>
      <div
        className="channel"
      >
        <input
          name="channel"
          onChange={handleChannelChange({ setActiveChannel, ref, })}
          type="number"
          min={0}
          max={16}
          value={activeChannel}
        />
      </div>
      <div
        className="instrument"
      >
        <select
          onChange={handleInstrumentChange({ generator, channel: activeChannel, setInstruments, ref, })}
          value={instruments[activeChannel]}
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
      </div>
      <div
        className="pedals"
      >
        <button
          tabIndex={-1}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              height: '1em',
            }}
            viewBox="0 0 176 256"
          >
            <path
              style={{
                fill: 'currentColor'
              }}
              d="M-59,191a48,48,0,0,1-48-48A48,48,0,0,1-59,95h.008a63.584,63.584,0,0,0,24.9-5.028,63.974,63.974,0,0,0,10.871-5.9,64.449,64.449,0,0,0,9.472-7.816A64.446,64.446,0,0,0-5.93,66.783,64.009,64.009,0,0,0-.03,55.912,63.6,63.6,0,0,0,5,31c0-.108,0-.219,0-.327V-47.875H5V-65H69V63a128.967,128.967,0,0,1-2.6,25.8,127.346,127.346,0,0,1-7.459,24.026,128.119,128.119,0,0,1-11.8,21.743,128.925,128.925,0,0,1-15.63,18.943,128.953,128.953,0,0,1-18.944,15.63,128.1,128.1,0,0,1-21.743,11.8A127.4,127.4,0,0,1-33.2,188.4,128.959,128.959,0,0,1-59,191Z"
              transform="translate(107 65)"
            />
          </svg>
          <span
            style={{
              position: 'absolute',
              left: -999999,
            }}
          >
            Soft
          </span>
        </button>
        <button
          tabIndex={-1}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              height: '1em',
            }}
            viewBox="0 0 128 261"
          >
            <path
              style={{
                fill: 'currentColor'
              }}
              d="M-107,132h0c0-57.757,32-59.832,32-101.422V-65h64V30.577C-11,72.167,21,74.241,21,132h0a64,64,0,0,1-64,64A64,64,0,0,1-107,132Z"
              transform="translate(107 65)"
            />
          </svg>
          <span
            style={{
              position: 'absolute',
              left: -999999,
            }}
          >
            Harmonic
          </span>
        </button>
        <button
          tabIndex={-1}
          type="button"
          onMouseDown={handlePedalChange({ generator, pedal: 67, activeChannel, ref, })(127)}
          onMouseUp={handlePedalChange({ generator, pedal: 67, activeChannel, ref, })(0)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              height: '1em',
            }}
            viewBox="0 0 128 261"
          >
            <path
              style={{
                fill: 'currentColor'
              }}
              d="M-107,132h0c0-57.757,32-59.832,32-101.422V-65h64V30.577C-11,72.167,21,74.241,21,132h0a64,64,0,0,1-64,64A64,64,0,0,1-107,132Z"
              transform="translate(107 65)"
            />
          </svg>
          <span
            style={{
              position: 'absolute',
              left: -999999,
            }}
          >
            Una Corda
          </span>
        </button>
        <button
          tabIndex={-1}
          type="button"
          onMouseDown={handlePedalChange({ generator, pedal: 66, activeChannel, ref, })(127)}
          onMouseUp={handlePedalChange({ generator, pedal: 66, activeChannel, ref, })(0)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              height: '1em',
            }}
            viewBox="0 0 128 261"
          >
            <path
              style={{
                fill: 'currentColor'
              }}
              d="M-107,132h0c0-57.757,32-59.832,32-101.422V-65h64V30.577C-11,72.167,21,74.241,21,132h0a64,64,0,0,1-64,64A64,64,0,0,1-107,132Z"
              transform="translate(107 65)"
            />
          </svg>
          <span
            style={{
              position: 'absolute',
              left: -999999,
            }}
          >
            Sostenuto
          </span>
        </button>
        <button
          tabIndex={-1}
          type="button"
          onMouseDown={handlePedalChange({ generator, pedal: 64, activeChannel, ref, })(127)}
          onMouseUp={handlePedalChange({ generator, pedal: 64, activeChannel, ref, })(0)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 176 256"
            style={{
              height: '1em',
              transform: 'scaleX(-1)',
            }}
          >
            <path
              style={{
                fill: 'currentColor'
              }}
              d="M-59,191a48,48,0,0,1-48-48A48,48,0,0,1-59,95h.008a63.584,63.584,0,0,0,24.9-5.028,63.974,63.974,0,0,0,10.871-5.9,64.449,64.449,0,0,0,9.472-7.816A64.446,64.446,0,0,0-5.93,66.783,64.009,64.009,0,0,0-.03,55.912,63.6,63.6,0,0,0,5,31c0-.108,0-.219,0-.327V-47.875H5V-65H69V63a128.967,128.967,0,0,1-2.6,25.8,127.346,127.346,0,0,1-7.459,24.026,128.119,128.119,0,0,1-11.8,21.743,128.925,128.925,0,0,1-15.63,18.943,128.953,128.953,0,0,1-18.944,15.63,128.1,128.1,0,0,1-21.743,11.8A127.4,127.4,0,0,1-33.2,188.4,128.959,128.959,0,0,1-59,191Z"
              transform="translate(107 65)"
            />
          </svg>
          <span
            style={{
              position: 'absolute',
              left: -999999,
            }}
          >
            Sustain
          </span>
        </button>
      </div>
    </React.Fragment>
  )
}

export default App
