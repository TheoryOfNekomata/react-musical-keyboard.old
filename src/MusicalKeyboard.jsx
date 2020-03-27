import * as React from 'react'
import * as PropTypes from 'prop-types'

const OCTAVE_OFFSETS = {
  0: 0, // C
  0.5: (1 / 12) + (1 / 384), // C half sharp
  1: (1 / 12) + (1 / 384), // C sharp
  1.5: (1 / 12) + (1 / 384), // D half flat
  2: 1 / 7, // D
  2.5: (3 / 12) + (1 / 96), // D half sharp
  3: (3 / 12) + (1 / 96), // D sharp
  3.5: (3 / 12) + (1 / 96), // E half flat
  4: 2 / 7, // E
  4.5: (37 / 96) + (1 / 96), // E half sharp
  5: 3 / 7, // F
  5.5: (6 / 12) + (1 / 96),
  6: (6 / 12) + (1 / 96),
  6.5: (6 / 12) + (1 / 96),
  7: 4 / 7,
  7.5: (8 / 12) + (1 / 192),
  8: (8 / 12) + (1 / 192),
  8.5: (8 / 12) + (1 / 192),
  9: 5 / 7,
  9.5: (10 / 12) + (1 / 192),
  10: (10 / 12) + (1 / 192),
  10.5: (10 / 12) + (1 / 192),
  11: 6 / 7,
  11.5: (93 / 96) + (1 / 192),
}

const REVERSE_OCTAVE_OFFSETS = Array.from(OCTAVE_OFFSETS)
  .reduce((r, o) => [o, ...r], [])

//
//    01    03       06    08    10
//
// 00    02    04 05    07    09    11
//

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

const calculateTop = ({ accidentalKeyHeight, octaveDivision, }) => keyId => {
  if (isBottomRowAccidental(keyId)) {
    return accidentalKeyHeight / 3
  }
  if (isAccidental(keyId) && octaveDivision === 24) {
    return accidentalKeyHeight * 2 / 3
  }
  return 0
}

const calculateWidth = ({ equalWidths, }) => {
  if (equalWidths) {
    return keyId => {
      const pitchClass = keyId % 12
      let width
      if ([0, 4, 5, 11].includes(pitchClass)) {
        width = 1 / 8
      } else if ([2, 7, 9].includes(pitchClass)) {
        width = 1 / 6
      } else {
        width = 1 / 12
      }
      return `${width * 100}%`
    }
  }
  return keyId => {
    let width
    if (isMiddleRowAccidental(keyId)) {
      width = 3 / 48
    } else {
      width = isAccidental(keyId) || isTopRowAccidental(keyId) || isBottomRowAccidental(keyId) ? (1 / 12) : (1 / 7)
    }
    return `${width * 100}%`
  }
}

const calculateHeight = ({ accidentalKeyHeight, octaveDivision, }) => keyId => {
  if (isTopRowAccidental(keyId)) {
    return accidentalKeyHeight / 3
  }
  if (isBottomRowAccidental(keyId)) {
    return accidentalKeyHeight / 3
  }
  if (isMiddleRowAccidental(keyId)) {
    return accidentalKeyHeight * 5 / 6
  }
  if (octaveDivision === 24 && isAccidental(keyId)) {
    return accidentalKeyHeight / 3
  }
  if (isAccidental(keyId)) {
    return accidentalKeyHeight
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

const calculateAccidentalOpacity = keyId => {
  if (isMiddleRowAccidental(keyId)) {
    return 1
  }

  if (isTopRowAccidental(keyId)) {
    return 1
  }

  if (isAccidental(keyId)) {
    return 1
  }

  if (isBottomRowAccidental(keyId)) {
    return 0
  }

  return 1
}

const calculateKeyColor = keyId => {
  if (
    isAccidental(keyId)
    || isTopRowAccidental(keyId)
    || isMiddleRowAccidental(keyId)
    || isBottomRowAccidental(keyId)
  ) {
    return 'currentColor'
  }
  return 'inherit'
}

/**
 * A component for events that a controller with the likeness of a musical keyboard triggers (for instance, MIDI
 * events).
 */
const MusicalKeyboard = React.forwardRef(({
  startKey = 9,
  endKey = 96,
  equalWidths = false,
  style = {},
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
        ...style,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          marginLeft: `-${OCTAVE_OFFSETS[startKey % 12] * 100 / Object.keys(octaves).length}%`,
          marginRight: `-${REVERSE_OCTAVE_OFFSETS[endKey % 12] * 100 / Object.keys(octaves).length}%`,
          display: 'flex',
          height: '100%',
          backgroundColor: 'inherit',
        }}
      >
        {
          Object.entries(octaves).map(([octave, octaveKeys, ], i, theOctaves) => (
            <div
              key={octave}
              style={{
                verticalAlign: 'top',
                width: `${
                  1 / theOctaves.length
                  * 100
                }%`,
                height: '100%',
                backgroundColor: 'inherit',
                zIndex: theOctaves.length - i,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  marginLeft: i === 0 ? 'auto' : `-${OCTAVE_OFFSETS[octaveKeys[0].id % 12] * 100}%`,
                  marginRight: `-${REVERSE_OCTAVE_OFFSETS[(octaveKeys[octaveKeys.length - 1].id) % 12] * 100}%`,
                  position: 'relative',
                  backgroundColor: 'inherit',
                }}
              >
                {
                  octaveKeys.map(key => (
                    <div
                      key={key.id}
                      style={{
                        position: 'absolute',
                        top: calculateTop({ accidentalKeyHeight, octaveDivision, })(key.id),
                        left: `${OCTAVE_OFFSETS[key.id % 12] * 100}%`,
                        width: calculateWidth({ equalWidths, })(key.id),
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
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: '1px solid',
                            boxSizing: 'border-box',
                            backgroundColor: 'inherit',
                          }}
                        >
                          <span
                            style={{
                              display: 'block',
                              width: '100%',
                              height: '100%',
                              backgroundColor: (
                                typeof key.velocity === 'number'
                                  ? 'Highlight'
                                  : calculateKeyColor(key.id)
                              ),
                              opacity: calculateAccidentalOpacity(key.id)
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
                  ))
                }
              </div>
            </div>
          ))
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
  style: PropTypes.object,
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
  /** The style of the natural keys. */
  naturalKeyStyle: PropTypes.func,
  /** The style of the accidental (flat/sharp) keys. */
  accidentalKeyStyle: PropTypes.func,
  /** The orientation of the keyboard. */
  orientation: PropTypes.oneOf(['normal', 'rotate-90', 'rotate-180', 'rotate-270']),
  /** The array of activated keys via their key numbers. */
  keysOn: PropTypes.arrayOf(PropTypes.number),
}

export default MusicalKeyboard
