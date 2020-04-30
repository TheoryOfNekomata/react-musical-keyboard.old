let bounds

export const recalculateBoundingClientRects = current => {
  window.requestAnimationFrame(() => {
    bounds = Array
      .from(current.children[0].children)
      .reduce((r, o) => [o, ...r], [])
      .map(theOctave => ({
        bounds: theOctave.getBoundingClientRect(),
        children: Array
          .from(theOctave.querySelectorAll('[data-id]'))
          .reduce((r, o) => [o, ...r], [])
          .map(k => ({
            id: k.dataset.id,
            offsetHeight: k.offsetHeight,
            bounds: k.getBoundingClientRect(),
          }))
      }))
  })
}

export default (clientX, clientY) => {
  const theOctave = bounds.find(o => {
    const { top, right, bottom, left, } = o.bounds

    return (
      left <= clientX
      && clientX <= right
      && top <= clientY
      && clientY <= bottom
    )
  })

  if (theOctave) {
    const keys = theOctave.children
    const theKey = keys.find(k => {
      const { top, right, bottom, left, } = k.bounds

      return (
        left <= clientX
        && clientX <= right
        && top <= clientY
        && clientY <= bottom
      )
    })

    if (theKey) {
      const { offsetHeight, bounds, } = theKey
      const { top, } = bounds
      const offsetY = clientY - top
      return {
        id: theKey.id,
        velocity: offsetY / offsetHeight
      }
    }
  }
  return null
}
