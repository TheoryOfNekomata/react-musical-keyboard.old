const isNaturalKey = key => {
  const pitchIndex = key.id % 12
  switch (pitchIndex) {
    case 0:
    case 2:
    case 4:
    case 5:
    case 7:
    case 9:
    case 11:
      return true
    default:
      break
  }
  return false
}

export default isNaturalKey
