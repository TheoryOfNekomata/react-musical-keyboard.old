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
  const [k, setKeysOn, ] = React.useState([])
  const keyboardRef = React.useRef(ref ? ref.current : null)

  const triggerKeyOn = source => (id, velocity) => {
    console.log(source, 'on')
    if (onKeyOn) {
      onKeyOn({
        target: {
          value: {
            id,
            velocity,
          },
        },
        source,
      })
    }
  }

  const triggerKeyOff = source => id => {
    console.log(source, 'off')
    if (onKeyOff) {
      onKeyOff({
        target: {
          value: {
            id,
          },
        },
        source,
      })
    }
  }

  const getKeyAndVelocity = e => {
    const { clientY, clientX, } = e
    const { current, } = keyboardRef
    const octaves = Array
      .from(current.children).slice(0, -1)
      .sort((a, b) => b.style.zIndex - a.style.zIndex)
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
        .sort((a, b) => b.style.zIndex - a.style.zIndex)
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
    if (e.buttons === 1) {
      const keyAndVelocity = getKeyAndVelocity(e)
      if (keyAndVelocity !== null) {
        setKeysOn(oldKeysOn => {
          const { velocity, id } = keyAndVelocity
          triggerKeyOn('mouse')(id, velocity)
          return [
            ...oldKeysOn,
            id,
          ]
        })
      }
    }
  }

  const handleMouseUp = e => {
    const keyAndVelocity = getKeyAndVelocity(e)
    if (keyAndVelocity !== null) {
      setKeysOn(oldKeysOn => {
        const { id } = keyAndVelocity
        triggerKeyOff('mouse')(id)
        return oldKeysOn.filter(k => k !== id)
      })
    }
  }

  const handleMouseMove = e => {
    if (e.buttons === 1) {
      const keyAndVelocity = getKeyAndVelocity(e)
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
  }

  const handleTouchStart = e => {
    const { targetTouches, } = e
    Array.from(targetTouches).forEach(t => {
      const keyAndVelocity = getKeyAndVelocity(t)
      if (keyAndVelocity !== null) {
        const { velocity, id } = keyAndVelocity
        triggerKeyOn('touch')(id, velocity)
      }
    })
  }

  const handleTouchMove = e => {
    const { targetTouches, } = e
    Array.from(targetTouches).forEach(t => {
      const keyAndVelocity = getKeyAndVelocity(t)
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
      const keyAndVelocity = getKeyAndVelocity(t)
      if (keyAndVelocity !== null) {
        const { id } = keyAndVelocity
        triggerKeyOff('touch')(id)
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
        triggerKeyOn('keyboard')({ id, }, 0.75)
      }
    }

    const handleKeyUp = e => {
      if (window.document.activeElement !== keyboardRef.current) {
        return
      }
      const { keyCode, } = e
      const { [keyCode]: id = null, } = keyboardMapping
      if (typeof id === 'number') {
        triggerKeyOff('keyboard')({ id, })
      }
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true, })
    window.addEventListener('keyup', handleKeyUp, { capture: true, })

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true, })
      window.removeEventListener('keyup', handleKeyUp, { capture: true, })
    }
  }, [])

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

  const theOctaves = Object.entries(octaves)

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
        theOctaves.map(([octave, octaveKeys, ], i, theOctaves) => {
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
                      data-key-id={key.id}
                      tabIndex={-1}
                      disabled={disabled}
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
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: theOctaves.length + 1,
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
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
