import * as React from 'react'
import * as PropTypes from 'prop-types'
import createKeysState from './services/createKeysState'
import * as METRICS from './services/metrics'
import isProperAccidental from './services/isProperAccidental'
import isInBetweenAccidental from './services/isInBetweenAccidental'
import getKeyPlacement from './services/getKeyPlacement'
import getKeyAndVelocity from './services/getKeyAndVelocity'

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
}, passedRef) => {
  const [keysState, setKeysState, ] = React.useState(
    createKeysState(startKey, endKey, octaveDivision)
  )
  const [theOctaves, setOctaves, ] = React.useState([])
  const [keysOnState, setKeysOn, ] = React.useState(keysOn)
  const [metrics, setMetrics, ] = React.useState(METRICS[keySpacing])
  const [playedKeysOnState, setPlayedKeysOnState, ] = React.useState(keysOn)
  const [, setMouseVelocity, ] = React.useState(0)
  const [touch, setTouch, ] = React.useState(false)
  const keyboardRef = passedRef || React.useRef(null)

  const handleMouseDown = e => {
    if (touch) {
      return
    }
    const { buttons, clientX, clientY, } = e
    if (buttons !== 1) {
      return
    }
    const { current, } = keyboardRef
    const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
    if (keyAndVelocity !== null) {
      const { velocity, id } = keyAndVelocity
      setMouseVelocity(oldVelocity => {
        const theVelocity = oldVelocity === null ? velocity : oldVelocity
        setKeysOn(oldKeysOn => [
          ...oldKeysOn,
          [activeChannel, id, theVelocity],
        ])
        return theVelocity
      })
    }
  }

  const handleMouseUp = e => {
    if (touch) {
      return
    }
    const { clientX, clientY, } = e
    const { current, } = keyboardRef
    const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
    if (keyAndVelocity !== null) {
      const { id } = keyAndVelocity
      setMouseVelocity(() => {
        setKeysOn(oldKeysOn => oldKeysOn.filter(([c, k,]) => !(
          c === activeChannel
          || k === id
        )))
        return null
      })
    }
  }

  const handleMouseMove = e => {
    const { buttons, clientX, clientY, } = e
    if (buttons !== 1) {
      return
    }
    const { current, } = keyboardRef
    const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
    if (keyAndVelocity !== null) {
      const { id, } = keyAndVelocity
      setMouseVelocity(oldVelocity => {
        setKeysOn(oldKeysOn => [
          ...oldKeysOn.filter(([c, k, ]) => !(
            c === activeChannel
            || k === id
          )),
          [activeChannel, id, oldVelocity],
        ])
        return oldVelocity
      })
    }
  }

  const handleTouchStart = e => {
    setTouch(true)
    const { targetTouches, } = e
    Array.from(targetTouches).forEach(t => {
      const { clientX, clientY, } = t
      const { current, } = keyboardRef
      const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
      if (keyAndVelocity !== null) {
        const { velocity, id, } = keyAndVelocity
        setMouseVelocity(oldVelocity => {
          const theVelocity = oldVelocity === null ? velocity : oldVelocity
          setKeysOn(oldKeysOn => [
            ...oldKeysOn,
            [activeChannel, id, theVelocity],
          ])
          return theVelocity
        })
      }
    })
  }

  const handleTouchMove = e => {
    const { changedTouches, } = e
    Array.from(changedTouches).forEach(t => {
      const { clientX, clientY, } = t
      const { current, } = keyboardRef
      const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
      if (keyAndVelocity !== null) {
        const { id, } = keyAndVelocity
        setMouseVelocity(oldVelocity => {
          setKeysOn(oldKeysOn => [
            ...oldKeysOn.filter(([c, k,]) => !(
              c === activeChannel
              || k === id
            )),
            [activeChannel, id, oldVelocity],
          ])
          return oldVelocity
        })
      }
    })
  }

  const handleTouchEnd = e => {
    const { changedTouches, } = e
    Array.from(changedTouches).forEach(t => {
      const { clientX, clientY, } = t
      const { current, } = keyboardRef
      const keyAndVelocity = getKeyAndVelocity(current)(clientX, clientY)
      if (keyAndVelocity !== null) {
        const { id, } = keyAndVelocity
        setMouseVelocity(oldVelocity => {
          setKeysOn(oldKeysOn => [
            ...oldKeysOn.filter(([c, k, ]) => !(
              c === activeChannel
              || k === id
            )),
          ])
          return oldVelocity
        })
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
      if (['string', 'number'].includes(typeof id)) {
        setKeysOn(oldKeysOn => {
          const keyMatch = oldKeysOn.find(([c2, k2]) => {
            return c2 === activeChannel && id === k2
          })

          return Boolean(keyMatch)
            ? oldKeysOn
            : [
              ...oldKeysOn,
              [activeChannel, id, keyboardVelocity],
            ]
        })
      }
    }

    const handleKeyUp = e => {
      if (window.document.activeElement !== keyboardRef.current) {
        return
      }
      const { keyCode, } = e
      const { [keyCode]: id = null, } = keyboardMapping
      if (['string', 'number'].includes(typeof id)) {
        setKeysOn(oldKeysOn => oldKeysOn.filter(([c, k, ]) => {
          if (c !== activeChannel) {
            return true
          }
          return (k !== id)
        }))
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
  }, [playable, activeChannel, keyboardMapping, keyboardRef, keyboardVelocity, ])

  React.useEffect(() => {
    setKeysState(createKeysState(startKey, endKey, octaveDivision))
  }, [startKey, endKey, octaveDivision, ])

  React.useEffect(() => {
    setPlayedKeysOnState(oldPlayedKeysOnState => {
      const added = keysOnState.filter(([c, k,]) => {
        const keyMatch = oldPlayedKeysOnState.find(([c2, k2]) => {
          return c2 === c && k === k2
        })
        const hasMatch = Boolean(keyMatch)
        return !hasMatch
      })

      const removed = oldPlayedKeysOnState.filter(([c, k,]) => {
        const keyMatch = keysOnState.find(([c2, k2]) => {
          return c2 === c && k === k2
        })
        const hasMatch = Boolean(keyMatch)
        return !hasMatch
      })

      const retained = keysOnState.filter(([c, k,]) => {
        const keyMatch = oldPlayedKeysOnState.find(([c2, k2]) => {
          return c2 === c && k === k2
        })
        return Boolean(keyMatch)
      })

      added.forEach(([c, k, v, s]) => {
        if (onKeyOn) {
          onKeyOn({
            id: k,
            channel: c,
            velocity: v,
            source: s,
          })
        }
      })

      removed.forEach(([c, k, v, s]) => {
        if (onKeyOff) {
          onKeyOff({
            id: k,
            channel: c,
            velocity: v,
            source: s,
          })
        }
      })

      return [
        ...retained,
        ...added,
      ]
    })
  }, [keysOnState, onKeyOff, onKeyOn, ])

  React.useEffect(() => {
    setTouch(false)
  }, [])

  React.useEffect(() => {
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
    setOctaves(
      Object.entries(octaves).reduce((r, o) => [o, ...r], [])
    )
  }, [keysState, ])

  React.useEffect(() => {
    setMetrics(METRICS[keySpacing])
  }, [keySpacing, ])

  return (
    <div
      {...props}
      tabIndex={playable ? 0 : null}
      style={{
        ...main,
        position: 'relative',
        WebkitTapHighlightColor: 'rgba(255, 255, 255, 0)',
      }}
      ref={keyboardRef}
    >
      <span
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row-reverse',
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
            const lastKeyPitchClass = getKeyPlacement(octaveDivision)(lastKeyId)
            const firstKeyPitchClass = getKeyPlacement(octaveDivision)(firstKeyId)
            const { [lastKeyPitchClass]: lastKeyWidth, } = metrics.widths
            const { [firstKeyPitchClass]: negative, [lastKeyPitchClass]: positive, } = metrics.offsets
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
                      const placement = getKeyPlacement(octaveDivision)(key.id)
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
                      const placement = getKeyPlacement(octaveDivision)(id)
                      const { [placement]: baseKeyWidth, } = metrics.widths
                      const keyWidth = baseKeyWidth * (1 / flexBasis)
                      const { [placement]: keyPositive } = metrics.offsets
                      const keyOffset = (keyPositive - negative) * (1 / flexBasis)
                      const dataId = (octave * 12) + placement
                      return (
                        <span
                          key={id}
                          data-id={dataId}
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
                          {
                            playedKeysOnState
                              .filter(([, i]) => String(i) === String(dataId))
                              .map(([c, , v]) => (
                                <span
                                  key={c + ':' + dataId}
                                  style={{
                                    backgroundColor: channelColors[c],
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0.25 + (0.5 * v),
                                  }}
                                />
                              ))
                          }
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
                      const { [placement]: baseKeyWidth, } = metrics.widths
                      const keyWidth = baseKeyWidth * (1 / flexBasis)
                      const { [placement]: keyPositive } = metrics.offsets
                      const keyOffset = (keyPositive - negative) * (1 / flexBasis)
                      return (
                        <span
                          key={placement}
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
                              const dataId = ((octave * 12) + Number(placement)) + String.fromCharCode(i + 'a'.charCodeAt(0))

                              return (
                                <span
                                  key={id}
                                  data-id={dataId}
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
                                  {
                                    playedKeysOnState
                                      .filter(([, i]) => String(i) === String(dataId))
                                      .map(([c, , v]) => (
                                        <span
                                          key={c + ':' + dataId}
                                          style={{
                                            backgroundColor: channelColors[c],
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0.25 + (0.5 * v),
                                          }}
                                        />
                                      ))
                                  }
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
  /**
   * The starting key number of the keyboard.
   * This is an integer value which corresponds to a pitch with 12-EDO reference
   * (e.g. multiples of 12 are the same pitch with different octaves
   * */
  startKey: PropTypes.number,
  /**
   * The ending key number of the keyboard.
   * This is an integer value which corresponds to a pitch with 12-EDO reference
   * (e.g. multiples of 12 are the same pitch with different octaves
   * */
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
  keysOn: PropTypes.array,
  /** Is the component active? */
  playable: PropTypes.bool,
}

export default MusicalKeyboard
