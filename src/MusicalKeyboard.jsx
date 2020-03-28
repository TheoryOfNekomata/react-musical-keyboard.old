import * as React from 'react'
import * as PropTypes from 'prop-types'

const OCTAVE_OFFSETS = {
  0: 0,
  0.5: (1 / 12) + (1 / 384),
  1: (1 / 12) + (1 / 384),
  1.5: (1 / 12) + (1 / 384),
  2: 1 / 7,
  2.5: (3 / 12) + (1 / 96),
  3: (3 / 12) + (1 / 96),
  3.5: (3 / 12) + (1 / 96),
  4: 2 / 7,
  4.5: (37 / 96) + (1 / 96),
  5: 3 / 7,
  5.5: (6 / 12) + (1 / 96),
  6: (6 / 12) + (1 / 96),
  6.5: (6 / 12) + (1 / 96),
  7: 4 / 7,
  7.5: (8 / 12) + (1 / 192),
  8: (8 / 12) + (1 / 192),
  8.5: (8 / 12) + (1 / 192),
  9: 5 / 7,
  9.5: (10 / 12),
  10: (10 / 12),
  10.5: (10 / 12),
  11: 6 / 7,
  11.5: (93 / 96) + (1 / 192),
}

const EQUAL_OCTAVE_OFFSETS = {
  0: 0,
  0.5: 1 / 12,
  1: 1 / 12,
  1.5: 1 / 12,
  2: 3 / 24,
  2.5: 3 / 12,
  3: 3 / 12,
  3.5: 3 / 12,
  4: 7 / 24,
  4.5: 4.5 / 12,
  5: 5 / 12,
  5.5: 6 / 12,
  6: 6 / 12,
  6.5: 6 / 12,
  7: 13 / 24,
  7.5: 8 / 12,
  8: 8 / 12,
  8.5: 8 / 12,
  9: 17 / 24,
  9.5: 10 / 12,
  10: 10 / 12,
  10.5: 10 / 12,
  11: 21 / 24,
  11.5: 11.5 / 12,
}

const isTopRowAccidental = keyId => {
  const ranges = [
    [0, 1],
    [2, 3],
    [5, 6],
    [7, 8],
    [9, 10],
  ]
  const pitchClass = keyId % 12

  return ranges.reduce(
    (inRange, currentRange) => (
      inRange || (currentRange[0] < pitchClass && pitchClass < currentRange[1])
    ),
    false
  )
}

const isBottomRowAccidental = keyId => {
  const ranges = [
    [1, 2],
    [3, 4],
    [6, 7],
    [8, 9],
    [10, 11],
  ]
  const pitchClass = keyId % 12

  return ranges.reduce(
    (inRange, currentRange) => (
      inRange || (currentRange[0] < pitchClass && pitchClass < currentRange[1])
    ),
    false
  )
}

const isMiddleRowAccidental = keyId => {
  const ranges = [
    [4, 5],
    [11, 12],
  ]
  const pitchClass = keyId % 12

  return ranges.reduce(
    (inRange, currentRange) => (
      inRange || (currentRange[0] < pitchClass && pitchClass < currentRange[1])
    ),
    false
  )
}

const isAccidental = keyId => [1, 3, 6, 8, 10].includes(keyId % 12)

const breakdownCssNumber = n => {
  const magnitude = parseInt(n)
  const magnitudeStr = String(magnitude)
  const unit = String(n).slice(magnitudeStr.length)
  return {
    magnitude,
    unit,
  }
}

const calculateTop = ({ accidentalKeyHeight, }) => keyId => {
  const { unit, magnitude, } = breakdownCssNumber(accidentalKeyHeight)
  if (isBottomRowAccidental(keyId)) {
    return `${magnitude * 2 / 3}${unit}`
  }
  return 0
}

const calculateWidth = ({ equalWidths, }) => {
  if (equalWidths) {
    return keyId => {
      const pitchClass = keyId % 12
      if ([0, 4, 5, 11].includes(pitchClass)) {
        return 1 / 8
      } else if ([2, 7, 9].includes(pitchClass)) {
        return 1 / 6
      }
      return 1 / 12
    }
  }
  return keyId => {
    let width
    if (isMiddleRowAccidental(keyId)) {
      width = 3 / 48
    } else {
      width = isAccidental(keyId) || isTopRowAccidental(keyId) || isBottomRowAccidental(keyId) ? (1 / 12) : (1 / 7)
    }
    return width
  }
}

const calculateHeight = ({ accidentalKeyHeight, }) => keyId => {
  const { unit, magnitude, } = breakdownCssNumber(accidentalKeyHeight)
  if (isTopRowAccidental(keyId)) {
    return `${magnitude / 3}${unit}`
  }
  if (isBottomRowAccidental(keyId)) {
    return `${magnitude / 3}${unit}`
  }
  if (isMiddleRowAccidental(keyId)) {
    return `${magnitude * 5 / 6}${unit}`
  }
  if (isAccidental(keyId)) {
    return `${magnitude}${unit}`
  }
  return '100%'
}

const calculateZIndex = keyId => {
  if (isTopRowAccidental(keyId) || isMiddleRowAccidental(keyId) || isBottomRowAccidental(keyId)) {
    return 2
  }
  if (isAccidental(keyId)) {
    return 1
  }
  return 0
}

const createKeysState = (startKeyId, endKeyId, octaveDivision) => (
  new Array(((endKeyId - startKeyId) * (octaveDivision / 12)) + 1)
    .fill({ velocity: null, })
    .map((k, i) => ({
      ...k,
      id: startKeyId + (i / (octaveDivision / 12)),
    }))
)

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
  orientation = 'normal',
  disabled = false,
  ...props
}, ref) => {
  const [keysState, setKeysState, ] = React.useState(
    createKeysState(startKey, endKey, octaveDivision)
  )

  React.useEffect(() => {
    setKeysState(
      createKeysState(startKey, endKey, octaveDivision)
    )
  }, [startKey, endKey, octaveDivision, ])

  React.useEffect(() => {
    setKeysState(keys => keys.map(k => ({
      ...k,
      velocity: keysOn[k.id],
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
        position: 'relative',
        overflow: 'hidden',
        lineHeight: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '100%',
          backgroundColor: 'inherit',
        }}
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
                      <div
                        key={key.id}
                        style={{
                          position: 'absolute',
                          top: calculateTop({ accidentalKeyHeight, octaveDivision, })(key.id),
                          left: `${keyOffset * 100}%`,
                          width: `${keyWidth * 100}%`,
                          height: calculateHeight({ accidentalKeyHeight, octaveDivision, })(key.id),
                          zIndex: calculateZIndex(key.id),
                          backgroundColor: 'inherit',
                        }}
                      >
                        <button
                          tabIndex={-1}
                          disabled={disabled}
                          style={{
                            border: 0,
                            background: 'transparent',
                            font: 'inherit',
                            padding: 0,
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            outline: 0,
                            backgroundColor: 'inherit',
                            color: 'inherit',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              boxSizing: 'border-box',
                              backgroundColor: 'inherit',
                            }}
                          >
                            <span
                              style={{
                                ...keyStyles(key),
                                display: 'block',
                                width: '100%',
                                height: '100%',
                                boxSizing: 'border-box',
                              }}
                            />
                          </span>
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
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
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
  /** The orientation of the keyboard. */
  orientation: PropTypes.oneOf(['normal', 'rotate-90', 'rotate-180', 'rotate-270']),
  /** The array of activated keys via their key numbers. */
  keysOn: PropTypes.arrayOf(PropTypes.number),
  /** Is the component active? */
  disabled: PropTypes.bool,
}

export default MusicalKeyboard
