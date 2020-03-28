import getKeyFrequency from './getKeyFrequency'

export default (baseFrequency = 440) => function WaveSoundGenerator() {
  const oscillators = {}
  const AudioContext = window.AudioContext || window.webkitAudioContext
  const audioCtx = new AudioContext()
  const sounds = 'sine triangle sawtooth square'.split(' ')

  let sound = 0

  this.changeSound = soundId => {
    sound = soundId
  }

  this.soundOn = (id, volume) => {
    if (oscillators[id]) {
      oscillators[id].stop()
      delete oscillators[id]
    }

    oscillators[id] = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillators[id].type = sounds[sound]
    oscillators[id].connect(gainNode)
    gainNode.connect(audioCtx.destination)
    gainNode.gain.value = volume * 0.001

    oscillators[id].frequency.value = getKeyFrequency(id, 69, baseFrequency)
    oscillators[id].start()
  }

  this.soundOff = id => {
    if (oscillators[id]) {
      try {
        oscillators[id].stop()
      } catch (err) {}
      delete oscillators[id]
    }
  }

  this.getSounds = () => 'sine triangle sawtooth square'.split(' ')
}
