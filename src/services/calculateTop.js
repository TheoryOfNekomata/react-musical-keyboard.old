import breakdownCssNumber from './breakdownCssNumber'
import isBottomRowAccidental from './isBottomRowAccidental'

export default ({ accidentalKeyHeight, }) => keyId => {
  const { unit, magnitude, } = breakdownCssNumber(accidentalKeyHeight)
  if (isBottomRowAccidental(keyId)) {
    return `${magnitude * 2 / 3}${unit}`
  }
  return 0
}
