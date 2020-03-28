import calculateNonEqualWidth from './calculateNonEqualWidth'
import calculateEqualWidth from './calculateEqualWidth'

export default ({ equalWidths, }) => {
  if (equalWidths) {
    return calculateNonEqualWidth
  }
  return calculateEqualWidth
}
