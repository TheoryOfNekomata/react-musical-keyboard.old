import getKeyPlacementRanges from './getKeyPlacementRanges'

export default octaveDivision => keyId => {
  const pitchClass = Number(keyId) % 12
  const accidentalPlacements = getKeyPlacementRanges(octaveDivision)

  const [theAccidentalPlacement = null, ] = Object
    .entries(accidentalPlacements)
    .find(([, [start, end],]) => start <= pitchClass && pitchClass < end)

  const a = Number(theAccidentalPlacement)

  if (a === 12) {
    return 0
  }
  return a
}
