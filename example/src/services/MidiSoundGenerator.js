
export default function MidiSoundGenerator() {
  let midiOutput = null
  const channel = 0

  window.navigator.requestMIDIAccess().then((midiAccess) => {
    for (let e of midiAccess.outputs.values()) {
      if (midiOutput === null) {
        midiOutput = e
      }
    }
  })

  this.changeSound = sound => {
    if (midiOutput) {
      midiOutput.send([ parseInt(`11000000`, 2) | channel, sound, ])
    }
  }

  this.soundOn = (id, volume = 0x7f) => {
    if (midiOutput) {
      midiOutput.send([ parseInt(`10010000`, 2) | channel, id, volume, ])
    }
  }

  this.soundOff = (id, volume = 0x7f) => {
    if (midiOutput) {
      midiOutput.send([ parseInt(`10000000`, 2) | channel, id, volume, ])
    }
  }

  this.sendMessage = (ccId, value) => {
    if (midiOutput) {
      midiOutput.send([ parseInt(`10110000`, 2) | channel, ccId, value, ])
    }
  }
}
