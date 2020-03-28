import * as React from 'react'
import * as PropTypes from 'prop-types'
import MusicalKeyboard from 'react-musical-keyboard'

const App = ({
  startKey,
  endKey,
  keyboardMapping,
  generator,
}) => {
  const [keysOn, setKeysOn, ] = React.useState({})
  const sounds = generator.getSounds()
  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateAreas: `
          '.       .          .          .'
          '.       instrument instrument instrument'
          'sliders keyboard   keyboard   keyboard'
          '.       .          pedals     .'
        `,
        gridTemplateRows: 'auto min-content 100px min-content',
        gridTemplateColumns: '100px auto min-content auto',
      }}
    >
      <div
        style={{
          gridArea: 'keyboard',
          backgroundColor: 'white',
          color: 'black',
          position: 'relative',
        }}
      >
        <MusicalKeyboard
          startKey={startKey}
          endKey={endKey}
          keysOn={keysOn}
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
      <div
        style={{
          gridArea: 'instrument',
        }}
      >
        <select
          style={{
            width: '100%',
          }}
        >
          {
            sounds.map((s, i) => (
              <option
                key={i}
              >
                {s}
              </option>
            ))
          }
        </select>
      </div>
      <div
        style={{
          gridArea: 'pedals',
          whiteSpace: 'nowrap',
        }}
      >
        <button>
          Soft Pedal
        </button>
        <button>
          Harmonic Pedal
        </button>
        <button>
          Una Corda
        </button>
        <button>
          Sostenuto
        </button>
        <button>
          Sustain
        </button>
      </div>
    </div>
  )
}

export default App
