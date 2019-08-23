const getOctaveAdjustment = firstKey => {
  const pitchIndex = firstKey.id % 12
  switch (pitchIndex) {
    case 2:
      return 0.95
    case 4:
      return 0.85
    case 5:
      return 1.05
    case 7:
      return 0.9
    case 9:
      return 0.85
    default:
      break
  }
  return 1
}

export default getOctaveAdjustment
