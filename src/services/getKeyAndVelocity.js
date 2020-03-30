export default current => (clientX, clientY) => {
  const octaves = Array
    .from(current.children[0].children)
    .reduce((r, o) => [o, ...r], [])
  const theOctave = octaves.find(o => {
    const { top, right, bottom, left, } = o.getBoundingClientRect()

    return (
      left <= clientX
      && clientX <= right
      && top <= clientY
      && clientY <= bottom
    )
  })

  if (theOctave) {
    const keys = Array
      .from(theOctave.querySelectorAll('[data-id]'))
      .reduce((r, o) => [o, ...r], [])
    const theKey = keys.find(k => {
      const { top, right, bottom, left, } = k.getBoundingClientRect()

      return (
        left <= clientX
        && clientX <= right
        && top <= clientY
        && clientY <= bottom
      )
    })

    if (theKey) {
      const { offsetHeight, } = theKey
      const { top, } = theKey.getBoundingClientRect()
      const offsetY = clientY - top
      return {
        id: theKey.dataset.id,
        velocity: offsetY / offsetHeight
      }
    }
  }

  return null
}
