import * as React from 'react'
import * as PropTypes from 'prop-types'
import createKeysState from './services/createKeysState'
import * as METRICS from './services/metrics'
import {
  isInBetweenAccidental,
  isProperAccidental,
  snapToNearestAccidentalPlacement
} from './services/isAccidentalPlacement'

const DEFAULT_CHANNEL_COLORS = [
  '#000055',
  '#005500',
  '#550000',
  '#555500',
  '#0000aa',
  '#00aa00',
  '#00aaaa',
  '#aa0000',
  '#aa00aa',
  '#aaaa00',
  '#0000ff',
  '#00ff00',
  '#00ffff',
  '#ff0000',
  '#ff00ff',
  '#ffff00',
]

const defaultKeyStyles = () => ({
  border: '1px solid black',
})

/**
 * A component for events that a controller with the likeness of a musical keyboard triggers (for instance, MIDI
 * events).
 */
const MusicalKeyboard = React.forwardRef(({
  startKey = 9,
  endKey = 96,
  keySpacing = 'standard',
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
  inBetweenAccidentalKeyHeight = accidentalKeyHeight,
  keyboardVelocity = 0.75,
  keysOn = [],
  channelColors = DEFAULT_CHANNEL_COLORS,
  octaveDivision = 12,
  activeChannel = 0,
  playable = false,
  ...props
}, keyboardRef) => {
  const [keysState, setKeysState, ] = React.useState(
    createKeysState(startKey, endKey, octaveDivision)
  )
  const [keysOnState, setKeysOn, ] = React.useState(keysOn)

  const triggerKeyOn = source => channel => (id, velocity) => {
    if (onKeyOn) {
      onKeyOn({
        id,
        velocity,
        channel,
        source,
      })
    }
  }

  const triggerKeyOff = source => channel => id => {
    if (onKeyOff) {
      onKeyOff({
        id,
        channel,
        source,
      })
    }
  }

  const getKeyAndVelocity = current => (clientX, clientY) => {
    const octaves = Array
      .from(current.children[0].children)
      .sort((a, b) => Number(b.dataset.octave) - Number(a.dataset.octave))
    const theOctave = octaves.find(o => {
      const { top, right, bottom, left, } = o.getBoundingClientRect()

      return (
        left <= clientX
        && clientX <= right
        && top <= clientY
        && clientY <= bottom
      )
    })

    if (theOctave) {
      const keys = Array
        .from(theOctave.children)
        .reduce((r, o) => [o, ...r], [])
      const theKey = keys.find(k => {
        const { top, right, bottom, left, } = k.getBoundingClientRect()

        return (
          left <= clientX
          && clientX <= right
          && top <= clientY
          && clientY <= bottom
        )
      })
      const { offsetHeight, } = theKey
      const { top, } = current.getBoundingClientRect()
      const offsetY = clientY - top
      return {
        id: Number(theKey.dataset.keyId),
        velocity: offsetY / offsetHeight
      }
    }

    return null
  }

  const handleMouseDown = e => {
    const { buttons, clientX, clientY, } = e
    const { current, } = keyboardRef
    if (buttons !== 1) {
      return
    }
    const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
    if (keyAndVelocity !== null) {
      setKeysOn(oldKeysOn => {
        const { velocity, id } = keyAndVelocity
        triggerKeyOn('mouse')(activeChannel)(id, velocity)
        return [
          ...oldKeysOn,
          [activeChannel, id, velocity, 'mouse'],
        ]
      })
    }
  }

  const handleMouseUp = e => {
    const { clientX, clientY, } = e
    const { current, } = keyboardRef
    const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
    if (keyAndVelocity !== null) {
      setKeysOn(oldKeysOn => {
        const { id } = keyAndVelocity
        triggerKeyOff('mouse')(activeChannel)(id)
        return oldKeysOn.filter(k => k !== id)
      })
    }
  }

  const handleMouseMove = e => {
    const { buttons, clientX, clientY, } = e
    const { current, } = keyboardRef
    if (buttons !== 1) {
      return
    }
    const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
    setKeysOn(oldKeysOn => {
      const removedKeys = keyAndVelocity !== null ? oldKeysOn.filter(k => k !== keyAndVelocity.id) : oldKeysOn
      const retainedKeys = keyAndVelocity !== null ? [keyAndVelocity.id] : []

      removedKeys.forEach(k => {
        triggerKeyOff('mouse')(k)
      })

      if (keyAndVelocity !== null) {
        if (!oldKeysOn.includes(keyAndVelocity.id)) {
          triggerKeyOn('mouse')(keyAndVelocity.id, keyAndVelocity.velocity)
        }
      }

      return retainedKeys
    })
  }

  const handleTouchStart = e => {
    const { targetTouches, } = e
    Array.from(targetTouches).forEach(t => {
      const { clientX, clientY, } = t
      const { current, } = keyboardRef
      const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
      if (keyAndVelocity !== null) {
        const { velocity, id } = keyAndVelocity
        triggerKeyOn('touch')(id, velocity)
      }
    })
  }

  const handleTouchMove = e => {
    const { targetTouches, } = e
    Array.from(targetTouches).forEach(t => {
      const { clientX, clientY, } = t
      const { current, } = keyboardRef
      const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
      setKeysOn(oldKeysOn => {
        const removedKeys = keyAndVelocity !== null ? oldKeysOn.filter(k => k !== keyAndVelocity.id) : oldKeysOn
        const retainedKeys = keyAndVelocity !== null ? [keyAndVelocity.id] : []

        removedKeys.forEach(k => {
          triggerKeyOff('touch')(k)
        })

        if (keyAndVelocity !== null) {
          if (!oldKeysOn.includes(keyAndVelocity.id)) {
            triggerKeyOn('touch')(keyAndVelocity.id, keyAndVelocity.velocity)
          }
        }

        return retainedKeys
      })
    })
  }

  const handleTouchEnd = e => {
    const { changedTouches, } = e
    Array.from(changedTouches).forEach(t => {
      const { clientX, clientY, } = t
      const { current, } = keyboardRef
      const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
      if (keyAndVelocity !== null) {
        const { id } = keyAndVelocity
        triggerKeyOff('touch')(activeChannel)(id)
      }
    })
  }

  React.useEffect(() => {
    const handleKeyDown = e => {
      if (window.document.activeElement !== keyboardRef.current) {
        return
      }
      const { keyCode, } = e
      const { [keyCode]: id = null, } = keyboardMapping
      if (typeof id === 'number') {
        triggerKeyOn('keyboard')(activeChannel)(id, 0.75)
      }
    }

    const handleKeyUp = e => {
      if (window.document.activeElement !== keyboardRef.current) {
        return
      }
      const { keyCode, } = e
      const { [keyCode]: id = null, } = keyboardMapping
      if (typeof id === 'number') {
        triggerKeyOff('keyboard')(activeChannel)(id)
      }
    }

    if (playable) {
      window.addEventListener('keydown', handleKeyDown, { capture: true, })
      window.addEventListener('keyup', handleKeyUp, { capture: true, })
    }
    return () => {
      if (playable) {
        window.removeEventListener('keydown', handleKeyDown, { capture: true, })
        window.removeEventListener('keyup', handleKeyUp, { capture: true, })
      }
    }
  }, [playable, activeChannel, keyboardMapping, ])

  React.useEffect(() => {
    setKeysState(createKeysState(startKey, endKey, octaveDivision))
  }, [startKey, endKey, octaveDivision, ])

  React.useEffect(() => {
    setKeysOn(keysOn)
  }, [keysOn, ])



  // React.useEffect(() => {
  //   setKeysState(keys => keys.map(k => ({
  //     ...k,
  //     velocity: keysOn[k.id] || null,
  //   })))
  // }, [keysOn, ])

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

  const theOctaves = Object.entries(octaves).reduce((r, o) => [o, ...r], [])
  const theOctaveOffsets = METRICS[keySpacing].offsets
  const widths = METRICS[keySpacing].widths

  return (
    <div
      {...props}
      tabIndex={0}
      style={main}
      ref={keyboardRef}
    >
      <span
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row-reverse',
          position: 'relative',
          overflow: 'hidden',
          lineHeight: 1,
        }}
      >
        {
          theOctaves.map(([octave, octaveKeys, ]) => {
            const [firstKey, ] = octaveKeys
            const { id: firstKeyId, } = firstKey
            const [lastKey, ] = octaveKeys.slice(-1)
            const { id: lastKeyId, } = lastKey
            const lastKeyPitchClass = snapToNearestAccidentalPlacement(octaveDivision)(lastKeyId)
            const firstKeyPitchClass = snapToNearestAccidentalPlacement(octaveDivision)(firstKeyId)
            const { [lastKeyPitchClass]: lastKeyWidth, } = widths
            const { [firstKeyPitchClass]: negative, [lastKeyPitchClass]: positive, } = theOctaveOffsets
            const flexBasis = Math.min(positive + lastKeyWidth, 1) - negative

            const naturalKeys = octaveKeys.filter(key => !(
              isInBetweenAccidental(octaveDivision)(key.id)
              || isProperAccidental(octaveDivision)(key.id)
            ))

            const accidentalKeyGroups = Object
              .entries(
                octaveKeys
                  .filter(key => (isInBetweenAccidental(octaveDivision)(key.id) || isProperAccidental(octaveDivision)(key.id)))
                  .reduce(
                    (grouped, key) => {
                      const placement = snapToNearestAccidentalPlacement(octaveDivision)(key.id)
                      const { [placement]: group = [] } = grouped
                      return {
                        ...grouped,
                        [placement]: [
                          ...group,
                          key
                        ]
                      }
                    },
                    {}
                  )
              )

            return (
              <span
                key={octave}
                data-octave={octave}
                style={{
                  display: 'block',
                  width: `${(flexBasis) * 100}%`,
                  height: '100%',
                  position: 'relative',
                }}
              >
                {
                  naturalKeys
                    .map(key => {
                      const { id, } = key
                      const placement = snapToNearestAccidentalPlacement(octaveDivision)(id)
                      const { [placement]: baseKeyWidth, } = widths
                      const keyWidth = baseKeyWidth * (1 / flexBasis)
                      const { [placement]: keyPositive } = theOctaveOffsets
                      const keyOffset = (keyPositive - negative) * (1 / flexBasis)
                      return (
                        <span
                          key={id}
                          data-key-id={id}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: `${keyOffset * 100}%`,
                            width: `${keyWidth * 100}%`,
                            height: '100%',
                            border: 0,
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
                              ...keyStyles(key),
                              backgroundColor: 'white',
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
                        </span>
                      )
                    })
                }
                {
                  accidentalKeyGroups
                    .map(([placement, group]) => {
                      const { [placement]: baseKeyWidth, } = widths
                      const keyWidth = baseKeyWidth * (1 / flexBasis)
                      const { [placement]: keyPositive } = theOctaveOffsets
                      const keyOffset = (keyPositive - negative) * (1 / flexBasis)
                      return (
                        <span
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: `${keyOffset * 100}%`,
                            width: `${keyWidth * 100}%`,
                            height: isInBetweenAccidental(octaveDivision)(placement) ? inBetweenAccidentalKeyHeight : accidentalKeyHeight,
                            border: 0,
                            font: 'inherit',
                            padding: 0,
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            outline: 0,
                            color: 'inherit',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                          }}
                        >
                          {
                            group.map((key, i, g) => {
                              const { id, } = key
                              const dark = (g.length - 1 - i) % 2 === 0

                              return (
                                <span
                                  key={id}
                                  data-key-id={id}
                                  style={{
                                    height: '100%',
                                    position: 'relative',
                                  }}
                                >
                                  <span
                                    style={{
                                      backgroundColor: placement !== '4.5' && placement !== '11.5' ? (dark ? '#444' : '#888') : (dark ? '#ccc' : '#eee'),
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
                                      filter: 'invert(1)',
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
                                </span>
                              )
                            })
                          }
                        </span>
                      )
                    })
                }
              </span>
            )
          })
        }
      </span>
      {
        playable
        && (
          <span
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              display: 'block',
              cursor: 'pointer',
            }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        )
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
  octaveDivision: PropTypes.number,
  /** Manner of spacing of the keys? */
  keySpacing: PropTypes.oneOf(['standard', 'fruityLoops']),
  /** The array of activated keys via their key numbers. */
  keysOn: PropTypes.object,
  /** Is the component active? */
  playable: PropTypes.bool,
}

export default MusicalKeyboard
