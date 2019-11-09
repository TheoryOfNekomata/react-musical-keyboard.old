import * as React from 'react'
import * as Storybook from '@storybook/react'
import { number, select, } from '@storybook/addon-knobs'

import MusicalKeyboard from './MusicalKeyboard.jsx'

const pitchClasses = 'C C# D D# E F F# G G# A A# B'.split(' ')

const minorScale = [0, 2, 3, 5, 7, 8, 10, ]

const labels = {
  none: null,
  middleC: key => key.id === 60 ? 'C' : null,
  keyNumber: key => key.id,
  pitch: key => pitchClasses[key.id % pitchClasses.length],
  noteName: key => `${pitchClasses[key.id % pitchClasses.length]}${Math.floor(key.id / pitchClasses.length)}`,
  pitchClass: key => key.id % pitchClasses.length === 0 ? 'C' : null,
  octave: key => Math.floor(key.id / pitchClasses.length) === 4 ? pitchClasses[key.id % pitchClasses.length] : null,
  scale: key => minorScale.includes(key.id % pitchClasses.length) ? minorScale.indexOf(key.id % pitchClasses.length) + 1 : null,
}

const keysOn = {
  none: [],
  cMajor: [60, 64, 67],
  cMajor2: [48, 55, 64, 72],
  eFlatMajor: [27, 39, 51, 55, 58, 63],
}

const ranges = {
  twoOctaves: [48, 71],
  fourOctavesPlusOne: [36, 84],
  fourAndOneHalfOctaves: [36, 89],
  fiveOctavesPlusOne: [36, 96],
  sixAndOneThirdOctaves: [28, 103],
  pleyel: [24, 105],
  modernGrand: [21, 108],
  boesendorferImperial: [12, 108],
  stuartAndSons1: [12, 113],
  stuartAndSons2: [12, 119],
  fullMidi: [0, 127],
}

const keyboardLength = {
  normal: 'height',
  'rotate-180': 'height',
  'rotate-90': 'width',
  'rotate-270': 'width',
}

Storybook
  .storiesOf('React Musical Keyboard', module)
  .add('MusicalKeyboard', () => {
    const [startKey, endKey, ] = ranges[select(
      'Range',
      Object.keys(ranges),
      'twoOctaves',
    )]

    const orientation = select(
      'Orientation',
      [
        'normal',
        'rotate-90',
        'rotate-180',
        'rotate-270'
      ],
      'normal'
    )

    return (
      <MusicalKeyboard
        startKey={startKey}
        endKey={endKey}
        accidentalKeyHeight={number('Accidental key height', 65, { range: true, min: 1, max: 100, })}
        orientation={orientation}
        naturalKeyStyle={pressed => ({
          backgroundColor: pressed ? 'Highlight' : 'white',
          border: '1px solid',
        })}
        accidentalKeyStyle={pressed => ({
          backgroundColor: pressed ? 'Highlight' : 'currentColor',
          border: '1px solid',
        })}
        keysOn={keysOn[select(
          'Active Keys',
          {
            none: 'none',
            'C major': 'cMajor',
            'C major - voicing': 'cMajor2',
            'D# major': 'eFlatMajor',
          },
          'none',
        )]}
        style={{
          [keyboardLength[orientation]]: `${number('Keyboard length', 10, { range: true, min: 5, max: 20, })}v${keyboardLength[orientation].charAt(0)}`,
        }}
        labels={labels[select(
          'Label',
          {
            none: 'none',
            'middle C': 'middleC',
            'key number': 'keyNumber',
            pitch: 'pitch',
            'note name (pitch + octave)': 'noteName',
            'pitch class': 'pitchClass',
            octave: 'single octave',
            scale: 'scale',
          },
          'none',
        )]}
      />
    )
  })
