import getKeyPlacement from './getKeyPlacement'
import * as KEY_PLACEMENTS from './keyPlacements'

export default octaveDivision => keyId => {
  const pitchClass = getKeyPlacement(octaveDivision)(keyId)

  return [
    KEY_PLACEMENTS.C_SHARP,
    KEY_PLACEMENTS.D_SHARP,
    KEY_PLACEMENTS.F_SHARP,
    KEY_PLACEMENTS.G_SHARP,
    KEY_PLACEMENTS.A_SHARP
  ]
    .includes(pitchClass)
}
