import breakdownCssNumber from './breakdownCssNumber'
import isTopRowAccidental from './isTopRowAccidental'
import isBottomRowAccidental from './isBottomRowAccidental'
import isMiddleRowAccidental from './isMiddleRowAccidental'
import isAccidental from './isAccidental'

export default ({ accidentalKeyHeight, }) => keyId => {
  const { unit, magnitude, } = breakdownCssNumber(accidentalKeyHeight)
  if (isTopRowAccidental(keyId)) {
    return `${magnitude / 3}${unit}`
  }
  if (isBottomRowAccidental(keyId)) {
    return `${magnitude / 3}${unit}`
  }
  if (isMiddleRowAccidental(keyId)) {
    return `${magnitude * 5 / 6}${unit}`
  }
  if (isAccidental(keyId)) {
    return `${magnitude}${unit}`
  }
  return '100%'
}
