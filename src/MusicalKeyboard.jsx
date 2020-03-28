import * as React from 'react'
import * as PropTypes from 'prop-types'
import isAccidental from './services/isAccidental'
import calculateWidth from './services/calculateWidth'
import calculateHeight from './services/calculateHeight'
import calculateTop from './services/calculateTop'
import calculateZIndex from './services/calculateZIndex'
import createKeysState from './services/createKeysState'

import OCTAVE_OFFSETS from './services/octaveOffsets'
import EQUAL_OCTAVE_OFFSETS from './services/equalOctaveOffsets'

const defaultKeyStyles = key => {
  if (typeof key.velocity === 'number') {
    return {
      backgroundColor: 'Highlight',
      border: '1px solid',
    }
  }
  return {
    backgroundColor: isAccidental(key.id) ? 'currentColor' : 'inherit',
    border: '1px solid',
  }
}

/**
 * A component for events that a controller with the likeness of a musical keyboard triggers (for instance, MIDI
 * events).
 */
const MusicalKeyboard = React.forwardRef(({
  startKey = 9,
  endKey = 96,
  equalWidths = false,
  style: {
    main = {},
    key: keyStyles = defaultKeyStyles,
  } = {
    key: defaultKeyStyles,
  },
  onKeyOn = null,
  onKeyOff = null,
  labels = () => null,
  keyboardMapping = null,
  accidentalKeyHeight = '65%',
  keyboardVelocity = 0.75,
  keysOn = {},
  octaveDivision = 12,
  disabled = false,
  ...props
}, ref) => {
  const [keysState, setKeysState, ] = React.useState(
    createKeysState(startKey, endKey, octaveDivision)
  )
  const keyboardRef = React.useRef(ref ? ref.current : null)

  const triggerKeyOn = source => (key, velocity) => {
    const { current = null, } = keyboardRef
    if (onKeyOn && current !== null) {
      onKeyOn({
        target: {
          ...current,
          value: {
            ...key,
            velocity,
          },
        },
        source,
      })
    }
  }

  const triggerKeyOff = source => key => {
    const { current = null, } = keyboardRef
    if (onKeyOff && current !== null) {
      onKeyOff({
        target: {
          ...current,
          value: key,
        },
        source,
      })
    }
  }

  const handleMouseDown = key => e => {
    const { buttons, clientY, target, } = e
    const { offsetHeight, } = target
    const { current, } = keyboardRef
    const { top, } = current.getBoundingClientRect()
    const offsetY = clientY - top
    if (buttons === 1) {
      e.preventDefault()
      current.focus()
      triggerKeyOn('mouse')(key, offsetY / offsetHeight)
    }
  }

  const handleMouseUp = key => e => {
    triggerKeyOff(key)
  }

  React.useEffect(() => {
    setKeysState(createKeysState(startKey, endKey, octaveDivision))
  }, [startKey, endKey, octaveDivision, ])

  React.useEffect(() => {
    setKeysState(keys => keys.map(k => ({
      ...k,
      velocity: keysOn[k.id] || null,
    })))
  }, [keysOn, ])

  const octaves = keysState.reduce(
    (theOctaves, k) => {
      const octave = Math.floor(k.id / 12)
      const { [octave]: theOctave = [], } = theOctaves
      return {
        ...theOctaves,
        [octave]: [
          ...theOctave,
          k,
        ]
      }
    },
    {},
  )

  return (
    <div
      {...props}
      tabIndex={0}
      style={{
        ...main,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        lineHeight: 1,
      }}
      ref={keyboardRef}
    >
      {
        Object.entries(octaves).map(([octave, octaveKeys, ], i, theOctaves) => {
          const theOctaveOffsets = equalWidths ? EQUAL_OCTAVE_OFFSETS : OCTAVE_OFFSETS
          let flexBasis
          let lastKeyOffsetId = (octaveKeys[octaveKeys.length - 1].id) % 12
          let firstKeyOffsetId = (octaveKeys[0].id % 12)
          flexBasis = Math.min(theOctaveOffsets[lastKeyOffsetId] + calculateWidth({ equalWidths, })(octaveKeys[octaveKeys.length - 1].id), 1)
          let negative = theOctaveOffsets[firstKeyOffsetId]
          flexBasis -= negative

          return (
            <div
              key={octave}
              style={{
                width: `${(flexBasis) * 100}%`,
                height: '100%',
                backgroundColor: 'inherit',
                zIndex: theOctaves.length - i,
                position: 'relative',
              }}
            >
              {
                octaveKeys.map(key => {
                  let keyWidth = calculateWidth({ equalWidths, })(key.id)
                  keyWidth *= (1 / (flexBasis))

                  let keyOffset = theOctaveOffsets[key.id % 12]
                  keyOffset -= negative
                  keyOffset *= (1 / flexBasis)

                  return (
                    <button
                      key={key.id}
                      tabIndex={-1}
                      disabled={disabled}
                      onMouseDown={handleMouseDown(key)}
                      style={{
                        position: 'absolute',
                        top: calculateTop({ accidentalKeyHeight, octaveDivision, })(key.id),
                        left: `${keyOffset * 100}%`,
                        width: `${keyWidth * 100}%`,
                        height: calculateHeight({ accidentalKeyHeight, octaveDivision, })(key.id),
                        zIndex: calculateZIndex(key.id),
                        backgroundColor: 'inherit',
                        border: 0,
                        background: 'transparent',
                        font: 'inherit',
                        padding: 0,
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        outline: 0,
                        color: 'inherit',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: 'inherit',
                          ...keyStyles(key),
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          boxSizing: 'border-box',
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          filter: isAccidental(key.id) ? 'invert(1)' : null,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                          boxSizing: 'border-box',
                          paddingBottom: '0.5rem',
                        }}
                      >
                        <span
                          style={{
                            transform: 'rotate(-90deg)',
                          }}
                        >
                          {
                            typeof labels === 'function'
                              ? labels(key)
                              : null
                          }
                        </span>
                      </span>
                    </button>
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  )
})

MusicalKeyboard.displayName = 'MusicalKeyboard'

MusicalKeyboard.propTypes = {
  /** The starting key number of the keyboard. */
  startKey: PropTypes.number,
  /** The ending key number of the keyboard. */
  endKey: PropTypes.number,
  /** The outer style of the keyboard. */
  style: PropTypes.shape({
    main: PropTypes.object,
    key: PropTypes.object,
  }),
  /** Event handler that triggers when a key is activated. */
  onKeyOn: PropTypes.func,
  /** Event handler that triggers when a key is deactivated. */
  onKeyOff: PropTypes.func,
  /** Textual labels for each key. */
  labels: PropTypes.func,
  /** Keyboard mapping from key code to key number. */
  keyboardMapping: PropTypes.object,
  /** The length of the accidental keys with respect to the length of the keyboard. */
  accidentalKeyHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The velocity of the key when the keyboard is used to activate the key. */
  keyboardVelocity: PropTypes.number,
  /** How many notes should encompass a single octave? */
  octaveDivision: PropTypes.oneOf([12, 24, ]),
  /** Does any key occupy the same width? */
  equalWidths: PropTypes.bool,
  /** The array of activated keys via their key numbers. */
  keysOn: PropTypes.object,
  /** Is the component active? */
  disabled: PropTypes.bool,
}

export default MusicalKeyboard
