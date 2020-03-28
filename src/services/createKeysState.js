export default (startKeyId, endKeyId, octaveDivision) => (
  new Array(((endKeyId - startKeyId) * (octaveDivision / 12)) + 1)
    .fill({ velocity: null, })
    .map((k, i) => ({
      ...k,
      id: startKeyId + (i / (octaveDivision / 12)),
    }))
)
