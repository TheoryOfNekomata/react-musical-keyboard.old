import getPitchClass from './getPitchClass'

export default keyId => [1, 3, 6, 8, 10].includes(getPitchClass(keyId))
