import * as React from 'react'
import * as PropTypes from 'prop-types'

import getNaturalKeyIndexInOctave from './services/getNaturalKeyIndexInOctave'
import getKeyIndexInOctave from './services/getKeyIndexInOctave'

/**
 * A component for events that a controller with the likeness of a musical keyboard triggers (for instance, MIDI
 * events).
 */
const MusicalKeyboard = React.forwardRef(({
  startKey = 9,
  endKey = 96,
  style = {},
  onKeyOn = null,
  onKeyOff = null,
  labels = null,
  keyboardMapping = null,
  accidentalKeyHeight = '65%',
  keyboardVelocity = 0.75,
  keysOn = [],
  naturalKeyStyle = () => ({}),
  accidentalKeyStyle = () => ({}),
  orientation = 'normal',
  ...props
}, ref) => {
  const keyboardRef = ref || React.useRef(null)
  const [touchedKeys, setTouchedKeys, ] = React.useState([])
  const [, setKeyboardKeys, ] = React.useState([])
  const [octaveKeys, setOctaveKeys, ] = React.useState({})
  const [keys, setKeys, ] = React.useState({})
  const theOctaveKeys = Object.entries(octaveKeys)

  let heightAttribute
  let widthAttribute
  let flexDirection
  let topAttribute
  let leftAttribute
  let marginLeftAttribute
  let marginRightAttribute
  let clientYAttribute
  let offsetHeightAttribute

  switch (orientation) {
    default:
    case 'normal':
      heightAttribute = 'height'
      widthAttribute = 'width'
      flexDirection = 'row'
      topAttribute = 'top'
      leftAttribute = 'left'
      marginLeftAttribute = 'marginLeft'
      marginRightAttribute = 'marginRight'
      clientYAttribute = 'clientY'
      offsetHeightAttribute = 'offsetHeight'
      break
    case 'rotate-180':
      heightAttribute = 'height'
      widthAttribute = 'width'
      flexDirection = 'row-reverse'
      topAttribute = 'bottom'
      leftAttribute = 'right'
      marginLeftAttribute = 'marginRight'
      marginRightAttribute = 'marginLeft'
      clientYAttribute = 'clientY'
      offsetHeightAttribute = 'offsetHeight'
      break
    case 'rotate-90':
      heightAttribute = 'width'
      widthAttribute = 'height'
      flexDirection = 'column-reverse'
      topAttribute = 'left'
      leftAttribute = 'bottom'
      marginLeftAttribute = 'marginBottom'
      marginRightAttribute = 'marginTop'
      clientYAttribute = 'clientX'
      offsetHeightAttribute = 'offsetWidth'
      break
    case 'rotate-270':
      heightAttribute = 'width'
      widthAttribute = 'height'
      flexDirection = 'column'
      topAttribute = 'right'
      leftAttribute = 'top'
      marginLeftAttribute = 'marginTop'
      marginRightAttribute = 'marginBottom'
      clientYAttribute = 'clientX'
      offsetHeightAttribute = 'offsetWidth'
      break
  }

  const triggerKeyOn = source => (note, velocity) => {
    const { current = null, } = keyboardRef
    if (onKeyOn && current !== null) {
      onKeyOn({
        target: {
          ...current,
          value: {
            note,
            velocity,
          },
        },
        source,
      })
    }
  }

  const triggerKeyOff = source => note => {
    const { current = null, } = keyboardRef
    if (onKeyOff && current !== null) {
      onKeyOff({
        target: {
          ...current,
          value: {
            note,
          },
        },
        source,
      })
    }
  }

  const handleMouseLeave = key => e => {
    const { buttons, } = e
    if (buttons === 1) {
      triggerKeyOff('mouse')(key)
    }
  }

  const handleMouseEnter = key => e => {
    const { buttons, [clientYAttribute]: clientY, target, } = e
    const { [offsetHeightAttribute]: offsetHeight, } = target
    const { current, } = keyboardRef
    const { [topAttribute]: top, } = current.getBoundingClientRect()
    const offsetY = clientY - top
    if (buttons === 1) {
      triggerKeyOn('mouse')(key, offsetY / offsetHeight)
    }
  }

  const handleMouseClick = key => e => {
    const { buttons, [clientYAttribute]: clientY, target, } = e
    const { [offsetHeightAttribute]: offsetHeight, } = target
    const { current, } = keyboardRef
    const { [topAttribute]: top, } = current.getBoundingClientRect()
    const offsetY = clientY - top
    // todo cancel event if touch is started
    if (buttons === 1 && !touchedKeys.includes(key)) {
      e.preventDefault()
      current.focus()
      triggerKeyOn('mouse')(key, offsetY / offsetHeight)
    }
  }

  const handleTouchStart = e => {
    const { target, changedTouches, } = e
    const { [offsetHeightAttribute]: offsetHeight, } = target
    const [touch, ] = changedTouches
    const { [clientYAttribute]: clientY, } = touch
    const { current, } = keyboardRef
    const { [topAttribute]: top, } = current.getBoundingClientRect()
    const offsetY = clientY - top
    current.focus()

    const theTouchedKeys = Array
      .from(changedTouches)
      .map(touch => {
        const [currentOctave] = Array
          .from(current.children)
          .filter(o => {
            const bounds = o.getBoundingClientRect()
            return (
              bounds.left <= touch.clientX && touch.clientX <= bounds.left + bounds.width
              && bounds.top <= touch.clientY && touch.clientY <= bounds.top + bounds.height
            )
          })

        const [currentKey] = Array
          .from(currentOctave.children)
          .filter(k => {
            const bounds = k.getBoundingClientRect()
            return (
              bounds.left <= touch.clientX && touch.clientX <= bounds.left + bounds.width
              && bounds.top <= touch.clientY && touch.clientY <= bounds.top + bounds.height
            )
          })

        return Number(currentKey.dataset.key)
      })

    setTouchedKeys(oldTouchedKeys => (
      theTouchedKeys.reduce(
        (newTouchedKeys, touchedKey) => (
          oldTouchedKeys.includes(touchedKey)
            ? oldTouchedKeys
            : [...oldTouchedKeys, touchedKey]
        ),
        []
      )
    ))

    theTouchedKeys.forEach(k => {
      triggerKeyOn('touch')(k, offsetY / offsetHeight)
    })
  }

  const handleTouchEnd = e => {
    const { changedTouches, } = e
    const { current, } = keyboardRef

    const theTouchedKeys = Array
      .from(changedTouches)
      .map(touch => {
        const [currentOctave] = Array
          .from(current.children)
          .filter(o => {
            const bounds = o.getBoundingClientRect()
            return (
              bounds.left <= touch.clientX && touch.clientX <= bounds.left + bounds.width
              && bounds.top <= touch.clientY && touch.clientY <= bounds.top + bounds.height
            )
          })

        const [currentKey] = Array
          .from(currentOctave.children)
          .filter(k => {
            const bounds = k.getBoundingClientRect()
            return (
              bounds.left <= touch.clientX && touch.clientX <= bounds.left + bounds.width
              && bounds.top <= touch.clientY && touch.clientY <= bounds.top + bounds.height
            )
          })

        return Number(currentKey.dataset.key)
      })

    console.log(theTouchedKeys)

    theTouchedKeys.forEach(key => {
      triggerKeyOff('touch')(key)
      setTimeout(() => {
        setTouchedKeys(touchedKeys => touchedKeys.filter(k => k !== key))
      })
    })
  }

  const handleTouchMove = e => {
    // const { changedTouches, } = e
    // const { current, } = keyboardRef
    //
    // const theTouchedKeys = Array
    //   .from(changedTouches)
    //   .map(touch => {
    //     const [currentOctave] = Array
    //       .from(current.children)
    //       .filter(o => {
    //         const bounds = o.getBoundingClientRect()
    //         return (
    //           bounds.left <= touch.clientX && touch.clientX <= bounds.left + bounds.width
    //           && bounds.top <= touch.clientY && touch.clientY <= bounds.top + bounds.height
    //         )
    //       })
    //
    //     const [currentKey] = Array
    //       .from(currentOctave.children)
    //       .filter(k => {
    //         const bounds = k.getBoundingClientRect()
    //         return (
    //           bounds.left <= touch.clientX && touch.clientX <= bounds.left + bounds.width
    //           && bounds.top <= touch.clientY && touch.clientY <= bounds.top + bounds.height
    //         )
    //       })
    //
    //     return Number(currentKey.dataset.key)
    //   })
    //
    // setTimeout(() => {
    //   setTouchedKeys(touchedKeys => {
    //     const keysOn = touchedKeys.filter(k => theTouchedKeys.includes(k))
    //     const newKeysOn = theTouchedKeys.filter(k => !touchedKeys.includes(k))
    //
    //     const newTouchedKeys = [
    //       ...keysOn,
    //       ...newKeysOn
    //     ]
    //
    //     const keysOff = touchedKeys.filter(k => !newTouchedKeys.includes(k))
    //
    //     keysOff.forEach(key => {
    //       triggerKeyOff('touch', { id: key, })
    //     })
    //
    //     newTouchedKeys.forEach(key => {
    //       triggerKeyOn('touch', { id: key, })
    //     })
    //
    //     return newTouchedKeys
    //   })
    // })
  }

  const handleMouseUp = key => e => {
    e.preventDefault()
    triggerKeyOff('mouse')(key)
  }

  const handleKeyDown = e => {
    const {
      altKey,
      shiftKey,
      ctrlKey,
      metaKey,
      keyCode,
    } = e
    if (altKey || shiftKey || ctrlKey || metaKey) {
      return
    }
    if (keyboardMapping && keyboardMapping[keyCode]) {
      e.preventDefault()
    } else {
      return
    }
    setKeyboardKeys(c => {
      if (c.includes(keyCode)) {
        return c
      }
      const theKey = keyboardMapping[keyCode]
      if (keyboardMapping !== null && theKey) {
        triggerKeyOn('keyboard')(keys[theKey].id, keyboardVelocity)
      }
      return [...c, keyCode]
    })
  }

  const isPressed = key => Array.isArray(keysOn) && keysOn.includes(key.id)

  React.useEffect(() => {
    const theOctaveKeys = {}
    const theKeys = {}
    for (let k = startKey; k <= endKey; k += 1) {
      const octave = Math.floor(k / 12)
      if (!(octave in theOctaveKeys)) {
        theOctaveKeys[octave] = []
      }

      theKeys[k] = {
        id: k,
        octave,
      }

      theOctaveKeys[octave].push(theKeys[k])
    }
    setOctaveKeys(theOctaveKeys)
    setKeys(theKeys)
  }, [startKey, endKey, ])

  React.useEffect(() => {
    const handleKeyUp = e => {
      const {
        altKey,
        shiftKey,
        ctrlKey,
        metaKey,
        keyCode,
      } = e
      if (altKey || shiftKey || ctrlKey || metaKey) {
        return
      }
      if (keyboardMapping && keyboardMapping[keyCode]) {
        e.preventDefault()
      } else {
        return
      }
      setKeyboardKeys(c => {
        const theKey = keyboardMapping[keyCode]
        if (keyboardMapping !== null && theKey) {
          triggerKeyOff('keyboard')(theKey)
        }
        return c.filter(code => code !== keyCode)
      })
    }

    window.addEventListener('keyup', handleKeyUp, true)
    return () => {
      window.removeEventListener('keyup', handleKeyUp, true)
    }
  }, [keyboardMapping, triggerKeyOff, ])

  const allKeys = Object
    .values(octaveKeys)
    .reduce(
      (allOctaveKeys, keys) => [
        ...allOctaveKeys,
        ...keys,
      ],
      []
    )

  const allNaturalKeys = allKeys.filter(k => getNaturalKeyIndexInOctave(k) !== -1)

  return (
    <div
      {...props}
      style={{
        [widthAttribute]: '100%',
        [heightAttribute]: 100,
        minHeight: orientation === 'rotate-90' || orientation === 'rotate-270' ? '100vw' : null,
        ...style,
        lineHeight: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'inline-block',
      }}
      ref={keyboardRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      {
        theOctaveKeys.map(([octave, pitches,]) => {
          const octaveNaturalKeys = pitches.filter(p => getNaturalKeyIndexInOctave(p) !== -1)
          const octaveWidth = 100 * (octaveNaturalKeys.length / allNaturalKeys.length)

          return (
            <div
              key={octave}
              style={{
                display: 'inline-block',
                verticalAlign: 'top',
                [widthAttribute]: `${octaveWidth}%`,
                flex: 'auto',
                boxSizing: 'border-box',
                [heightAttribute]: '100%',
                position: 'relative',
              }}
            >
              {
                pitches.map(key => {
                  const octaveNaturalKeyWidth = 100 / octaveNaturalKeys.length
                  const octaveAccidentalKeyWidth = 100 / pitches.length
                  const octaveKeyWidth = (
                    getNaturalKeyIndexInOctave(key) !== -1
                      ? octaveNaturalKeyWidth
                      : octaveAccidentalKeyWidth
                  )

                  const octaveKeyLength = (
                    getNaturalKeyIndexInOctave(key) !== -1
                      ? '100%'
                      : accidentalKeyHeight
                  )

                  const octaveNaturalKeyLeftOffset = 100 * (getNaturalKeyIndexInOctave(key) / octaveNaturalKeys.length)
                  const octaveAccidentalKeyLeftOffset = 100 * (getKeyIndexInOctave(key) / pitches.length)
                  const octaveKeyRawLeftOffset = (
                    getNaturalKeyIndexInOctave(key) !== -1
                      ? octaveNaturalKeyLeftOffset
                      : octaveAccidentalKeyLeftOffset
                  )
                  const octaveKeyComputedLeftOffset = (
                    getNaturalKeyIndexInOctave(key) !== -1
                      ? octaveKeyRawLeftOffset - (100 * (getNaturalKeyIndexInOctave(octaveNaturalKeys[0]) / octaveNaturalKeys.length))
                      : octaveKeyRawLeftOffset - (100 * (getKeyIndexInOctave(pitches[0]) / pitches.length))
                      // : octaveKeyRawLeftOffset
                  )
                  const octaveKeyLeftOffset = (
                    octaveKeyComputedLeftOffset
                  )

                  return (
                    <div
                      key={key.id}
                      data-key={key.id}
                      style={{
                        position: 'absolute',
                        boxSizing: 'border-box',
                        [topAttribute]: 0,
                        [leftAttribute]: `${octaveKeyLeftOffset}%`,
                        [widthAttribute]: `${octaveKeyWidth}%`,
                        [heightAttribute]: octaveKeyLength,
                        zIndex: getNaturalKeyIndexInOctave(key) !== -1 ? 0 : 1,
                      }}
                      onMouseDown={handleMouseClick(key.id)}
                      onMouseEnter={handleMouseEnter(key.id)}
                      onMouseLeave={handleMouseLeave(key.id)}
                      onMouseUp={handleMouseUp(key.id)}
                    >
                      <div
                        style={{
                          backgroundColor: isPressed(key) ? 'Highlight' : (getNaturalKeyIndexInOctave(key) !== -1 ? 'transparent' : 'currentColor'),
                          border: '1px solid',
                          ...(
                            getNaturalKeyIndexInOctave(key) !== -1
                              ? naturalKeyStyle(isPressed(key))
                              : accidentalKeyStyle(isPressed(key))
                          ),
                          width: '100%',
                          height: '100%',
                          boxSizing: 'border-box',
                        }}
                      />
                      {
                        labels !== null
                        && (
                          <div
                            style={{
                              [widthAttribute]: '100%',
                              [heightAttribute]: accidentalKeyHeight,
                              position: 'absolute',
                              [topAttribute]: '50%',
                              [leftAttribute]: 0,
                              display: 'flex',
                              flexDirection,
                              justifyContent: 'center',
                              alignItems: 'center',
                              filter: getNaturalKeyIndexInOctave(key) !== -1 ? null : 'invert(100%)',
                              fontSize: '1vw',
                              pointerEvents: 'none',
                            }}
                          >
                            <div
                              style={{
                                transform: getNaturalKeyIndexInOctave(key) !== -1 || !'normal rotate-180'.split(' ').includes(orientation) ? null : 'rotate(90deg)',
                              }}
                            >
                              {labels(key)}
                            </div>
                          </div>
                        )
                      }
                    </div>
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
