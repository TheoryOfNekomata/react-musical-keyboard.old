import getKeyPlacement from './getKeyPlacement'

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
  const firstKeyPlacement = getKeyPlacement(octaveDivision)(Number(firstKey.id))
  const firstKeyPlacement12Edo = getKeyPlacement(12)(startKeyId)
  if (firstKeyPlacement !== firstKeyPlacement12Edo) {
    keysState.unshift({
      id: startKeyId,
      velocity: null,
      channel: null,
    })
  }

  const [lastKey, ] = keysState.slice(-1)
  const lastKeyPlacement = getKeyPlacement(octaveDivision)(Number(lastKey.id))
  const lastKeyPlacement12Edo = getKeyPlacement(12)(endKeyId)
  if (lastKeyPlacement !== lastKeyPlacement12Edo) {
    keysState.push({
      id: endKeyId,
      velocity: null,
      channel: null,
    })
  }

  return keysState
}
