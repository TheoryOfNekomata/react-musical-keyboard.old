const computeNaturalKeyMarginRight = key => {
  const pitchIndex = key.id % 12
  switch (pitchIndex) {
    case 0:
      return 0.65
    case 2:
      return 0.35
    case 5:
      return 0.75
    case 7:
      return 0.5
    case 9:
      return 0.25
    default:
      break
  }
  return 0
}

export default computeNaturalKeyMarginRight
