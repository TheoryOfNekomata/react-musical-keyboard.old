import getPitchClass from './getPitchClass'

export default keyId => {
  const ranges = [
    [1, 2],
    [3, 4],
    [6, 7],
    [8, 9],
    [10, 11],
  ]
  const pitchClass = getPitchClass(keyId)

  return ranges.reduce(
    (inRange, currentRange) => (
      inRange || (currentRange[0] < pitchClass && pitchClass < currentRange[1])
    ),
    false
  )
}
