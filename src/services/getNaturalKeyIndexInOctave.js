export default key => {
  const pitchIndex = key.id % 12
  const naturalKeys = [0, 2, 4, 5, 7, 9, 11]
  const naturalKeyIndex = naturalKeys.indexOf(pitchIndex)

  if (naturalKeyIndex === -1) {
    return null
  }
  return naturalKeyIndex
}
