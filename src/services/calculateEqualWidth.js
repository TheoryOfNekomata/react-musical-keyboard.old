import isMiddleRowAccidental from './isMiddleRowAccidental'
import isAccidental from './isAccidental'
import isTopRowAccidental from './isTopRowAccidental'
import isBottomRowAccidental from './isBottomRowAccidental'

export default keyId => {
  let width
  if (isMiddleRowAccidental(keyId)) {
    width = 3 / 48
  } else {
    width = isAccidental(keyId) || isTopRowAccidental(keyId) || isBottomRowAccidental(keyId) ? (1 / 12) : (1 / 7)
  }
  return width
}
