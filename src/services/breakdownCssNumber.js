export default n => {
  const magnitude = parseInt(n)
  const magnitudeStr = String(magnitude)
  const unit = String(n).slice(magnitudeStr.length)
  return {
    magnitude,
    unit: unit.length > 0 ? unit : 'px',
  }
}
