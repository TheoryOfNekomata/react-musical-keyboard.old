import * as React from 'react'
import * as PropTypes from 'prop-types'
import tinycolor from 'tinycolor2'

import isNaturalKey from './services/isNaturalKey'
import computeNaturalKeyMarginLeft from './services/computeNaturalKeyMarginLeft'
import computeNaturalKeyMarginRight from './services/computeNaturalKeyMarginRight'
import getOctaveAdjustment from './services/getOctaveAdjustment'

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
  naturalKeyColor = 'white',
  accidentalKeyColor = 'black',
  notesOn = [],
  ...props
}, ref) => {
  const keyboardRef = ref || React.useRef(null)
  const [, setKeyboardKeys, ] = React.useState([])
  const [octaveKeys, setOctaveKeys, ] = React.useState({})
  const [keys, setKeys, ] = React.useState({})
  const [, setMouseNotesOn, ] = React.useState([])
  const theOctaveKeys = Object.entries(octaveKeys)
  const naturalKeysLength = Object
    .values(octaveKeys)
    .reduce((k, l) => [...k, ...l], [])
    .filter(p => isNaturalKey(p))
    .length
  const [, setMouseVelocity, ] = React.useState(null)

  const triggerKeyOn = source => (key, noteVelocity) => {
    if (onKeyOn) {
      onKeyOn({
        target: {
          ...keyboardRef.current,
          value: {
            ...key,
            velocity: noteVelocity,
          },
        },
        source,
      })
    }
  }

  const triggerKeyOff = source => key => {
    if (onKeyOff) {
      onKeyOff({
        target: {
          ...keyboardRef.current,
          value: key,
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
    const { buttons, clientY, target, } = e
    const { top, } = keyboardRef.current.getBoundingClientRect()
    const offsetY = clientY - top
    if (buttons === 1) {
      triggerKeyOn('mouse')(key, offsetY / target.offsetHeight)
    }
  }

  const handleMouseClick = key => e => {
    const { buttons, clientY, target, } = e
    const { top, } = keyboardRef.current.getBoundingClientRect()
    const offsetY = clientY - top
    if (buttons === 1) {
      e.preventDefault()
      keyboardRef.current.focus()
      triggerKeyOn('mouse')(key, offsetY / target.offsetHeight)
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

  const computeKeyClickAreaStyle = (key, i, octavePitches) => {
    const naturalKey = isNaturalKey(key)
    const isFirstKey = octavePitches[0].id === key.id
    const isLastKey = octavePitches[octavePitches.length - 1].id === key.id
    const naturalKeyOctavePitches = octavePitches.filter(p => isNaturalKey(p))
    return {
      borderRadius: naturalKey ? '0 0 2% 2%' : '0 0 10% 10%',
      display: 'inline-block',
      verticalAlign: 'top',
      boxSizing: 'border-box',
      borderLeft: '1px solid black',
      borderBottom: naturalKey ? null : '1px solid black',
      marginLeft: naturalKey && !isFirstKey ? `-${100 * (1 / octavePitches.length) * getOctaveAdjustment(octavePitches[0]) * computeNaturalKeyMarginLeft(key)}%` : null,
      marginRight: naturalKey && !isLastKey ? `-${100 * (1 / octavePitches.length) * computeNaturalKeyMarginRight(key)}%` : null,
      width: naturalKey ? `${100 / naturalKeyOctavePitches.length}%` : `${100 / naturalKeyOctavePitches.length / 12 * 7}%`,
      height: naturalKey ? '100%' : accidentalKeyHeight,
      cursor: 'pointer',
      position: 'relative',
      zIndex: naturalKey ? 0 : 1,
      backgroundColor: 'black',
    }
  }

  const isPressed = key => Array.isArray(notesOn) && notesOn.includes(key.id)

  const computePressedKeyBackgroundImage = key => {
    const naturalKey = isNaturalKey(key)

    return (
      naturalKey
        ? `linear-gradient(to bottom, ${naturalKeyColor}, ${tinycolor(naturalKeyColor).setAlpha(0.9).toRgbString()})`
        : `linear-gradient(to bottom, ${accidentalKeyColor}, ${tinycolor(accidentalKeyColor).setAlpha(0.9).toRgbString()})`
    )
  }

  const computeNotPressedKeyBackgroundImage = key => {
    const naturalKey = isNaturalKey(key)
    return (
      naturalKey
        ? `linear-gradient(to bottom, ${naturalKeyColor}, ${naturalKeyColor})`
        : `linear-gradient(to bottom, ${accidentalKeyColor}, ${accidentalKeyColor})`
    )
  }

  const computeBackgroundImage = key => (
    isPressed(key)
      ? computePressedKeyBackgroundImage(key)
      : computeNotPressedKeyBackgroundImage(key)
  )

  const computePressedBoxShadow = key => (
    isNaturalKey(key)
      ? `0 0 4px 16px rgba(255,255,255,0) inset, 0 0 4px rgba(0,0,0,0.0), 2px -2px 1px -1px rgba(0,0,0,0.25) inset`
      : `0 0 4px rgba(0,0,0,0), 1px -1px 4px rgba(0,0,0,1) inset, -1.5px -2px 1px rgba(0,0,0,0.5) inset, 1.5px -1px 1px rgba(255,255,255,0.75) inset`
  )

  const computeNotPressedBoxShadow = key => (
    isNaturalKey(key)
      ? `0 0 4px 16px ${naturalKeyColor} inset, 0 0 4px rgba(0,0,0,0.75), 2px -2px 1px -1px rgba(0,0,0,0.25) inset`
      : `0 0 4px rgba(0,0,0,0.75), 1px -2px 4px ${tinycolor(accidentalKeyColor).darken(12).toRgbString()} inset, -2px -4px 1px ${tinycolor(accidentalKeyColor).darken(20).toRgbString()} inset, 2px -4px 1px rgba(255,255,255,0.75) inset`
  )

  const computeBoxShadow = key => (
    isPressed(key)
      ? computePressedBoxShadow(key)
      : computeNotPressedBoxShadow(key)
  )

  const computeColor = key => (
    isNaturalKey(key)
      ? 'var(--white-key-foreground-color)'
      : 'var(--black-key-foreground-color)'
  )

  const computeTransform = key => (
    isPressed(key)
      ? 'rotateX(10deg)'
      : 'rotateX(0deg)'
  )

  const computeKeyDisplayStyle = key => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    border: 0,
    padding: '0 0 1rem 0',
    width: '100%',
    height: '100%',
    borderRadius: '0 0 2px 2px',
    backgroundImage: computeBackgroundImage(key),
    boxShadow: computeBoxShadow(key),
    color: computeColor(key),
    transform: computeTransform(key),
    transformOrigin: 'top',
    textAlign: 'center',
    boxSizing: 'border-box',
    position: 'relative',
  })

  const computeKeyLabelStyle = key => {
    const naturalKey = isNaturalKey(key)
    return {
      position: 'absolute',
      bottom: '0.5rem',
      pointerEvents: 'none',
      filter: naturalKey ? null : 'invert(100%)',
      transform: naturalKey ? null : 'rotate(90deg)',
      transformOrigin: naturalKey ? null : 'top right',
      fontSize: '75%',
      width: '100%',
      textAlign: 'center',
      lineHeight: 1.5,
    }
  }

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
    window.addEventListener('keyup', handleKeyUp, true)
    return () => {
      window.removeEventListener('keyup', handleKeyUp, true)
    }
  }, [])

  return (
    <div
      {...props}
      style={{
        ...style,
        backgroundColor: 'black',
        boxSizing: 'border-box',
        borderWidth: '1px 0',
        borderStyle: 'solid',
        userSelect: 'none',
        overflow: 'hidden',
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
              display: 'inline-block',
              verticalAlign: 'top',
              height: '100%',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box',
              marginRight: octaveIndex === octaves.length - 1 ? '-1px' : null,
              width: `${pitches.filter(p => isNaturalKey(p)).length / naturalKeysLength * 100}%`,
            }}
          >
            {
              pitches.map((key, i, octavePitches) => (
                <div
                  key={key.id}
                  style={computeKeyClickAreaStyle(key, i, octavePitches)}
                  onMouseDown={handleMouseClick(key)}
                  onMouseEnter={handleMouseEnter(key)}
                  onMouseLeave={handleMouseLeave(key)}
                  onMouseUp={handleMouseUp(key)}
                >
                  <div
                    style={computeKeyDisplayStyle(key)}
                  />
                  <div
                    style={computeKeyLabelStyle(key)}
                  >
                    {
                      labels === null ? null : labels(key)
                    }
                  </div>
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
  startKey: PropTypes.number,
  endKey: PropTypes.number,
  style: PropTypes.shape(),
  onKeyOn: PropTypes.func,
  onKeyOff: PropTypes.func,
  labels: PropTypes.func,
  keyboardMapping: PropTypes.shape(),
  accidentalKeyHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  keyboardVelocity: PropTypes.number,
  naturalKeyColor: PropTypes.string,
  accidentalKeyColor: PropTypes.string,
  notesOn: PropTypes.arrayOf(PropTypes.number),
}

export default MusicalKeyboard
