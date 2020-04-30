import getKeyPlacementRanges from './getKeyPlacementRanges'

const memoizedAccidentalPlacements = {}

export default octaveDivision => keyId => {
  const pitchClass = Number(keyId) % 12
  const {
    [octaveDivision]: memoizedAccidentalPlacement = null
  } = memoizedAccidentalPlacements

  let theAccidentalPlacementEntries
  if (memoizedAccidentalPlacement === null) {
    memoizedAccidentalPlacements[octaveDivision] = theAccidentalPlacementEntries = Object.entries(getKeyPlacementRanges(octaveDivision))
  } else {
    theAccidentalPlacementEntries = memoizedAccidentalPlacement
  }

  const [theAccidentalPlacement = null, ] = theAccidentalPlacementEntries
    .find(([, [start, end],]) => start <= pitchClass && pitchClass < end)

  const a = Number(theAccidentalPlacement)

  if (a === 12) {
    return 0
  }
  return a
}
