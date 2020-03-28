import isTopRowAccidental from './isTopRowAccidental'
import isMiddleRowAccidental from './isMiddleRowAccidental'
import isBottomRowAccidental from './isBottomRowAccidental'
import isAccidental from './isAccidental'

export default keyId => {
  if (isTopRowAccidental(keyId) || isMiddleRowAccidental(keyId) || isBottomRowAccidental(keyId)) {
    return 2
  }
  if (isAccidental(keyId)) {
    return 1
  }
  return 0
}
