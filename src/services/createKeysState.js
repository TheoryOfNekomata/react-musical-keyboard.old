export default (startKeyId, endKeyId, octaveDivision) => {
  const keysState = []

  let i = 0
  let j = startKeyId
  for (; j <= endKeyId;) {
    keysState.push({
      id: j.toString(),
      velocity: null,
      channel: null,
    })
    i += 1
    j = startKeyId + ((12 * i) / octaveDivision)
  }

  return keysState
}
