import { snapToNearestAccidentalPlacement } from './isAccidentalPlacement'

export default (startKeyId, endKeyId, octaveDivision) => {
  const keysState = []

  let i = 0
  let j = 0

  do {
    if (j >= startKeyId) {
      keysState.push({
        id: j.toString(),
        velocity: null,
        channel: null,
      })
    }
    i += 1
    j = (12 * i) / octaveDivision
  } while (j <= endKeyId)

  const [firstKey, ] = keysState
  if (snapToNearestAccidentalPlacement(octaveDivision)(Number(firstKey.id)) !== snapToNearestAccidentalPlacement(12)(startKeyId)) {
    keysState.unshift({
      id: startKeyId,
      velocity: null,
      channel: null,
    })
  }

  const [lastKey, ] = keysState.slice(-1)
  if (snapToNearestAccidentalPlacement(octaveDivision)(Number(lastKey.id)) === snapToNearestAccidentalPlacement(12)(endKeyId)) {
    keysState.push({
      id: endKeyId,
      velocity: null,
      channel: null,
    })
  }

  return keysState
}
