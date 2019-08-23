const computeNaturalKeyMarginLeft = key => {
  const pitchIndex = key.id % 12
  switch (pitchIndex) {
    case 2:
      return 0.35
    case 4:
      return 0.65
    case 7:
      return 0.25
    case 9:
      return 0.5
    case 11:
      return 0.75
    default:
      break
  }
  return 0
}

export default computeNaturalKeyMarginLeft
