export default keyId => {
  const pitchClass = keyId % 12
  if ([0, 4, 5, 11].includes(pitchClass)) {
    return 1 / 8
  } else if ([2, 7, 9].includes(pitchClass)) {
    return 1 / 6
  }
  return 1 / 12
}
