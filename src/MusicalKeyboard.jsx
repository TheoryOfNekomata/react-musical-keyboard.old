import * as React from 'react'
import * as PropTypes from 'prop-types'

import getNaturalKeyIndexInOctave from './services/getNaturalKeyIndexInOctave'

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
  accidentalKeyHeight = '60%',
  keyboardVelocity = 0.75,
  keysOn = [],
  naturalKeyStyle = () => ({}),
  accidentalKeyStyle = () => ({}),
  orientation = 'normal',
  ...props
}, ref) => {
  const keyboardRef = ref || React.useRef(null)
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

  const triggerKeyOn = source => (key, noteVelocity) => {
    const { current = null, } = keyboardRef
    if (onKeyOn && current !== null) {
      onKeyOn({
        target: {
          ...current,
          value: {
            ...key,
            velocity: noteVelocity,
          },
        },
        source,
      })
    }
  }

  const triggerKeyOff = React.useCallback(source => key => {
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
  }, [onKeyOff, ])

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
    if (buttons === 1) {
      e.preventDefault()
      current.focus()
      triggerKeyOn('mouse')(key, offsetY / offsetHeight)
    }
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
        triggerKeyOn('keyboard')(keys[theKey], keyboardVelocity)
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
          triggerKeyOff(false)({ id: theKey, })
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

  const allNaturalKeys = allKeys.filter(k => getNaturalKeyIndexInOctave(k) !== null)

  return (
    <div
      {...props}
      style={{
        [widthAttribute]: '100%',
        [heightAttribute]: 100,
        minHeight: orientation === 'rotate-90' || orientation === 'rotate-270' ? '100vw' : null,
        ...style,
        lineHeight: 0,
        backgroundColor: 'currentColor',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection,
      }}
      ref={keyboardRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {
        theOctaveKeys.map(([octave, pitches,], octaveIndex, octaves) => (
          <div
            key={octave}
            style={{
              [widthAttribute]: 0,
              flex: 'auto',
              boxSizing: 'border-box',
              [heightAttribute]: '100%',
              position: 'relative',
              [marginLeftAttribute]:
                octaveIndex !== 0
                  ? null
                  : `${
                    -100 * (
                      (7 - pitches.filter(p => getNaturalKeyIndexInOctave(p) !== null).length) / (getNaturalKeyIndexInOctave(pitches[0]) ? allNaturalKeys.length : allNaturalKeys.length - 1)
                    )
                  }%`,
              [marginRightAttribute]:
                octaveIndex !== octaves.length - 1
                  ? null
                  : `${
                    -100 * (
                      (7 - pitches.filter(p => getNaturalKeyIndexInOctave(p) !== null).length) / (getNaturalKeyIndexInOctave(pitches.slice(-1)[0]) ? allNaturalKeys.length : allNaturalKeys.length - 1)
                    )
                  }%`,
            }}
          >
            {
              pitches.map(key => (
                <div
                  key={key.id}
                  style={{
                    position: 'absolute',
                    boxSizing: 'border-box',
                    [topAttribute]: 0,
                    [leftAttribute]:
                      getNaturalKeyIndexInOctave(key) !== null
                        ? `${100 * (getNaturalKeyIndexInOctave(key) / 7)}%`
                        : `${100 * (key.id % 12 / 12)}%`,
                    [widthAttribute]:
                      getNaturalKeyIndexInOctave(key) !== null
                        ? `${100 / 7}%`
                        : `${100 / 12}%`,
                    [heightAttribute]:
                      getNaturalKeyIndexInOctave(key) !== null
                        ? '100%'
                        : accidentalKeyHeight,
                    zIndex: getNaturalKeyIndexInOctave(key) !== null ? 0 : 1,
                  }}
                  onMouseDown={handleMouseClick(key)}
                  onMouseEnter={handleMouseEnter(key)}
                  onMouseLeave={handleMouseLeave(key)}
                  onMouseUp={handleMouseUp(key)}
                >
                  <div
                    style={{
                      ...(
                        getNaturalKeyIndexInOctave(key) !== null
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
                          filter: getNaturalKeyIndexInOctave(key) !== null ? null : 'invert(100%)',
                          fontSize: '1vw',
                          pointerEvents: 'none',
                        }}
                      >
                        <div
                          style={{
                            transform: getNaturalKeyIndexInOctave(key) !== null || !'normal rotate-180'.split(' ').includes(orientation) ? null : 'rotate(90deg)',
                          }}
                        >
                          {labels(key)}
                        </div>
                      </div>
                    )
                  }
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  )
})

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
