import getPitchClass from './getPitchClass'

export default keyId => {
  const ranges = [
    [0, 1],
    [2, 3],
    [5, 6],
    [7, 8],
    [9, 10],
  ]
  const pitchClass = getPitchClass(keyId)

  return ranges.reduce(
    (inRange, currentRange) => (
      inRange || (currentRange[0] < pitchClass && pitchClass < currentRange[1])
    ),
    false
  )
}
