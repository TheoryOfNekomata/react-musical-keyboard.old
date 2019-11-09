export default key => {
  const pitchIndex = key.id % 12
  const naturalKeys = [0, 2, 4, 5, 7, 9, 11]
  return naturalKeys.indexOf(pitchIndex)
}
