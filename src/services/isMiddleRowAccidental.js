export default keyId => {
  const ranges = [
    [4, 5],
    [11, 12],
  ]
  const pitchClass = keyId % 12

  return ranges.reduce(
    (inRange, currentRange) => (
      inRange || (currentRange[0] < pitchClass && pitchClass < currentRange[1])
    ),
    false
  )
}
