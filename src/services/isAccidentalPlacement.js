import getPitchClass from './getPitchClass'

export const snapToNearestAccidentalPlacement = octaveDivision => keyId => {
  const pitchClass = getPitchClass(keyId)

  let accidentalPlacements

  if (octaveDivision < 24) {
    accidentalPlacements = {
      0: [0, 0.0625], // C
      1: [0.0625, 1.875], // C#
      2: [1.875, 2.125], // D
      3: [2.125, 3.75], // D#
      4: [3.75, 4.25], // E
      4.5: [4.25, 4.65], // ef
      5: [4.65, 5.125], // F
      6: [5.125, 6.875], // F#
      7: [6.875, 7.125], // G
      8: [7.125, 8.75], // G#
      9: [8.75, 9.25], // A
      10: [9.25, 10.725], // A#
      11: [10.725, 11.2942], // B
      11.5: [11.2942, 11.7], // BC
      12: [11.7, 12]
    }
  } else if (octaveDivision < 48) {
    accidentalPlacements = {
      0: [0, 0.0625], // C
      1: [0.0625, 1.875], // C#
      2: [1.875, 2.125], // D
      3: [2.125, 3.75], // D#
      4: [3.75, 4.025], // E
      4.5: [4.025, 4.75], // ef
      5: [4.75, 5.125], // F
      6: [5.125, 6.875], // F#
      7: [6.875, 7.125], // G
      8: [7.125, 8.75], // G#
      9: [8.75, 9.25], // A
      10: [9.25, 10.725], // A#
      11: [10.725, 11.225], // B
      11.5: [11.225, 11.7], // BC
      12: [11.7, 12]
    }
  }

  const [theAccidentalPlacement = null, ] = Object
    .entries(accidentalPlacements)
    .find(([, [start, end],]) => start <= pitchClass && pitchClass < end)

  const a = Number(theAccidentalPlacement)

  if (a === 12) {
    return 0
  }
  return a
}

export const isProperAccidental = octaveDivision => keyId => {
  const pitchClass = snapToNearestAccidentalPlacement(octaveDivision)(keyId)

  return [1, 3, 6, 8, 10].includes(pitchClass)
}

// these are the accidental placements between E-F and B-C
export const isInBetweenAccidental = octaveDivision => keyId => {
  const pitchClass = snapToNearestAccidentalPlacement(octaveDivision)(keyId)
  return [4.5, 11.5].includes(pitchClass)
}
