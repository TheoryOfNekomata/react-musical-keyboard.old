const getOctave = d => {
  const octave = []
  for (let i = 0; i < 12; i += (12 / d)) {
    octave.push(i)
  }
  console.log(`${String(d).padStart(2)}EDO:`, octave.map(o => o.toFixed(3)).join(' '))
}

getOctave(31)
