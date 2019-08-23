import * as React from 'react'
import * as PropTypes from 'prop-types'
import tinycolor from 'tinycolor2'

import isWhiteKey from './services/isWhiteKey'
import computeWhiteKeyMarginLeft from './services/computeWhiteKeyMarginLeft'
import computeWhiteKeyMarginRight from './services/computeWhiteKeyMarginRight'
import getOctaveAdjustment from './services/getOctaveAdjustment'

const MusicalKeyboard = React.forwardRef(({
  startKey = 9,
  endKey = 96,
  style = {},
  onKeyOn = null,
  onKeyOff = null,
  labels = null,
  keyboardMapping = null,
  blackKeyHeight = '60%',
  keyboardVelocity = 0.75,
  whiteKeyColor = 'white',
  blackKeyColor = 'black',
  ...props
}, ref) => {
  const keyboardRef = ref || React.useRef(null)
  const [, setKeyboardKeys, ] = React.useState([])
  const [octaveKeys, setOctaveKeys, ] = React.useState({})
  const [keys, setKeys, ] = React.useState({})
  const [notesOn, setNotesOn, ] = React.useState([])
  const [, setMouseNotesOn, ] = React.useState([])
  const theOctaveKeys = Object.entries(octaveKeys)
  const whiteKeysLength = Object.values(octaveKeys).flat().filter(p => isWhiteKey(p)).length
  const [, setMouseVelocity, ] = React.useState(null)

  const triggerKeyOn = fromMouse => (key, noteVelocity) => {
    setNotesOn(notesOn => Array.from(new Set([
      ...notesOn,
      key.id,
    ])))

    if (fromMouse) {
      setMouseNotesOn(mouseNotesOn => Array.from(new Set([
        ...mouseNotesOn,
        key.id,
      ])))

      setMouseVelocity(oldVelocity => {
        const theMouseVelocity = (
          oldVelocity !== null
            ? oldVelocity
            : noteVelocity
        )

        if (onKeyOn) {
          onKeyOn({
            target: {
              ...keyboardRef.current,
              value: {
                ...key,
                velocity: theMouseVelocity,
              },
            },
          })
        }

        return theMouseVelocity
      })
      return
    }

    if (onKeyOn) {
      onKeyOn({
        target: {
          ...keyboardRef.current,
          value: {
            ...key,
            velocity: noteVelocity,
          },
        },
      })
    }
  }

  const triggerKeyOff = fromMouse => key => {
    window.setTimeout(() => {
      setNotesOn(keysOn => keysOn.filter(k => k !== key.id))
      if (fromMouse) {
        setMouseNotesOn(keysOn => {
          const newKeys = keysOn.filter(k => k !== key.id)
          setMouseVelocity(oldVelocity => (
            newKeys.length < 1
              ? null
              : oldVelocity
          ))
          return newKeys
        })
      }
    })

    if (onKeyOff) {
      onKeyOff({
        target: {
          ...keyboardRef.current,
          value: key,
        },
      })
    }
  }

  const handleMouseLeave = key => e => {
    const { buttons, } = e
    if (buttons === 1) {
      triggerKeyOff(true)(key)
    }
  }

  const handleMouseEnter = key => e => {
    const { buttons, clientY, target, } = e
    const offsetY = clientY - keyboardRef.current.offsetTop
    if (buttons === 1) {
      triggerKeyOn(true)(key, offsetY / target.offsetHeight)
    }
  }

  const handleMouseClick = key => e => {
    const { buttons, clientY, target, } = e
    const offsetY = clientY - keyboardRef.current.offsetTop
    if (buttons === 1) {
      e.preventDefault()
      keyboardRef.current.focus()
      triggerKeyOn(true)(key, offsetY / target.offsetHeight)
    }
  }

  const handleMouseUp = key => e => {
    e.preventDefault()
    triggerKeyOff(true)(key)
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
        triggerKeyOn(false)(keys[theKey], keyboardVelocity)
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
    const whiteKey = isWhiteKey(key)
    const isFirstKey = octavePitches[0].id === key.id
    const isLastKey = octavePitches[octavePitches.length - 1].id === key.id
    const whiteKeyOctavePitches = octavePitches.filter(p => isWhiteKey(p))
    return {
      borderRadius: whiteKey ? '0 0 2% 2%' : '0 0 10% 10%',
      display: 'inline-block',
      verticalAlign: 'top',
      boxSizing: 'border-box',
      borderLeft: '1px solid black',
      borderBottom: whiteKey ? null : '1px solid black',
      marginLeft: whiteKey && !isFirstKey ? `-${100 * (1 / octavePitches.length) * getOctaveAdjustment(octavePitches[0]) * computeWhiteKeyMarginLeft(key)}%` : null,
      marginRight: whiteKey && !isLastKey ? `-${100 * (1 / octavePitches.length) * computeWhiteKeyMarginRight(key)}%` : null,
      width: whiteKey ? `${100 / whiteKeyOctavePitches.length}%` : `${100 / whiteKeyOctavePitches.length / 12 * 7}%`,
      height: whiteKey ? '100%' : blackKeyHeight,
      cursor: 'pointer',
      position: 'relative',
      zIndex: whiteKey ? 0 : 1,
      backgroundColor: 'black',
    }
  }

  const isPressed = key => Array.isArray(notesOn) && notesOn.includes(key.id)

  const computePressedKeyBackgroundImage = key => {
    const whiteKey = isWhiteKey(key)

    return (
      whiteKey
        ? `linear-gradient(to bottom, ${whiteKeyColor}, ${tinycolor(whiteKeyColor).setAlpha(0.9).toRgbString()})`
        : `linear-gradient(to bottom, ${blackKeyColor}, ${tinycolor(blackKeyColor).setAlpha(0.9).toRgbString()})`
    )
  }

  const computeNotPressedKeyBackgroundImage = key => {
    const whiteKey = isWhiteKey(key)
    return (
      whiteKey
        ? `linear-gradient(to bottom, ${whiteKeyColor}, ${whiteKeyColor})`
        : `linear-gradient(to bottom, ${blackKeyColor}, ${blackKeyColor})`
    )
  }

  const computeBackgroundImage = key => (
    isPressed(key)
      ? computePressedKeyBackgroundImage(key)
      : computeNotPressedKeyBackgroundImage(key)
  )

  const computePressedBoxShadow = key => (
    isWhiteKey(key)
      ? `0 0 4px 16px rgba(255,255,255,0) inset, 0 0 4px rgba(0,0,0,0.0), 2px -2px 1px -1px rgba(0,0,0,0.25) inset`
      : `0 0 4px rgba(0,0,0,0), 1px -1px 4px rgba(0,0,0,1) inset, -1.5px -2px 1px rgba(0,0,0,0.5) inset, 1.5px -1px 1px rgba(255,255,255,0.75) inset`
  )

  const computeNotPressedBoxShadow = key => (
    isWhiteKey(key)
      ? `0 0 4px 16px ${whiteKeyColor} inset, 0 0 4px rgba(0,0,0,0.75), 2px -2px 1px -1px rgba(0,0,0,0.25) inset`
      : `0 0 4px rgba(0,0,0,0.75), 1px -2px 4px ${tinycolor(blackKeyColor).darken(12).toRgbString()} inset, -2px -4px 1px ${tinycolor(blackKeyColor).darken(20).toRgbString()} inset, 2px -4px 1px rgba(255,255,255,0.75) inset`
  )

  const computeBoxShadow = key => (
    isPressed(key)
      ? computePressedBoxShadow(key)
      : computeNotPressedBoxShadow(key)
  )

  const computeColor = key => (
    isWhiteKey(key)
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
    const whiteKey = isWhiteKey(key)
    return {
      position: 'absolute',
      bottom: '0.5rem',
      pointerEvents: 'none',
      filter: whiteKey ? null : 'invert(100%)',
      transform: whiteKey ? null : 'rotate(90deg)',
      transformOrigin: whiteKey ? null : 'top right',
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
              width: `${pitches.filter(p => isWhiteKey(p)).length / whiteKeysLength * 100}%`,
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
  blackKeyHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  keyboardVelocity: PropTypes.number,
  whiteKeyColor: PropTypes.string,
  blackKeyColor: PropTypes.string,
}

export default MusicalKeyboard
