const getKeyFrequency = (keyNumber, baseKeyNumber, baseKeyFrequency) => (
  baseKeyFrequency * Math.pow(
    Math.pow(2, 1 / 12),
    (keyNumber - baseKeyNumber)
  )
)

export default getKeyFrequency
