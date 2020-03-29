import * as KEY_PLACEMENTS from './keyPlacements'

export default octaveDivision => {
  if (octaveDivision >= 24) {
    return {
      [KEY_PLACEMENTS.C]: [0, 0.0625], // C
      [KEY_PLACEMENTS.C_SHARP]: [0.0625, 1.875], // C#
      [KEY_PLACEMENTS.D]: [1.875, 2.125], // D
      [KEY_PLACEMENTS.D_SHARP]: [2.125, 3.75], // D#
      [KEY_PLACEMENTS.E]: [3.75, 4.025], // E
      [KEY_PLACEMENTS.E_SHARP]: [4.025, 4.75], // ef
      [KEY_PLACEMENTS.F]: [4.75, 5.125], // F
      [KEY_PLACEMENTS.F_SHARP]: [5.125, 6.875], // F#
      [KEY_PLACEMENTS.G]: [6.875, 7.125], // G
      [KEY_PLACEMENTS.G_SHARP]: [7.125, 8.75], // G#
      [KEY_PLACEMENTS.A]: [8.75, 9.25], // A
      [KEY_PLACEMENTS.A_SHARP]: [9.25, 10.725], // A#
      [KEY_PLACEMENTS.B]: [10.725, 11.225], // B
      [KEY_PLACEMENTS.B_SHARP]: [11.225, 11.7], // BC
      [KEY_PLACEMENTS.C_NEXT_OCTAVE]: [11.7, 12]
    }
  }

  return {
    [KEY_PLACEMENTS.C]: [0, 0.0625], // C
    [KEY_PLACEMENTS.C_SHARP]: [0.0625, 1.875], // C#
    [KEY_PLACEMENTS.D]: [1.875, 2.125], // D
    [KEY_PLACEMENTS.D_SHARP]: [2.125, 3.75], // D#
    [KEY_PLACEMENTS.E]: [3.75, 4.25], // E
    [KEY_PLACEMENTS.E_SHARP]: [4.25, 4.65], // ef
    [KEY_PLACEMENTS.F]: [4.65, 5.125], // F
    [KEY_PLACEMENTS.F_SHARP]: [5.125, 6.875], // F#
    [KEY_PLACEMENTS.G]: [6.875, 7.125], // G
    [KEY_PLACEMENTS.G_SHARP]: [7.125, 8.75], // G#
    [KEY_PLACEMENTS.A]: [8.75, 9.25], // A
    [KEY_PLACEMENTS.A_SHARP]: [9.25, 10.725], // A#
    [KEY_PLACEMENTS.B]: [10.725, 11.2942], // B
    [KEY_PLACEMENTS.B_SHARP]: [11.2942, 11.7], // BC
    [KEY_PLACEMENTS.C_NEXT_OCTAVE]: [11.7, 12]
  }
}
