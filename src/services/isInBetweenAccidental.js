import getKeyPlacement from './getKeyPlacement'
import * as KEY_PLACEMENTS from './keyPlacements'

export default octaveDivision => keyId => {
  const pitchClass = getKeyPlacement(octaveDivision)(keyId)

  return [
    KEY_PLACEMENTS.E_SHARP,
    KEY_PLACEMENTS.B_SHARP,
  ]
    .includes(pitchClass)
}
