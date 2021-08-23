
// 0	nose
// 1	leftEye
// 2	rightEye
// 3	leftEar
// 4	rightEar
// 5	leftShoulder
// 6	rightShoulder
// 7	leftElbow
// 8	rightElbow
// 9	leftWrist
// 10	rightWrist
// 11	leftHip
// 12	rightHip
// 13	leftKnee
// 14	rightKnee
// 15	leftAnkle
// 16	rightAnkle

class KeypointStore {
  /**
   * Init the helper store
   */
  constructor() {
    this.data = {
      nose: 0,
      leftEye: 0,
      rightEye: 0,
      leftEar: 0,
      rightEar: 0,
      leftShoulder: 0,
      rightShoulder: 0,
      leftElbow: 0,
      rightElbow: 0,
      leftWrist: 0,
      rightWrist: 0,
      leftHip: 0,
      rightHip: 0,
      leftKnee: 0,
      rightKnee: 0,
      leftAnkle: 0,
      rightAnkle: 0,
    }
  }

  /**
   * Set a value to a key in the store
   *
   * @param {String} name key to save value to
   * @param {Mixed} val Value to set
   */
  set(name, val) {
    this.data[name] = val
  }

  /**
   * Get a value by the key name
   *
   * @param {String} name key to retrieve value for
   * @returns {Mixed}
   */
  get(name) {
    return this.data[name]
  }

  /**
   * Get two keynames as an array
   * Both keynames must exist or it returns
   * and empty array
   *
   * @param {String} name1 key name
   * @param {String} name2 key name
   * @returns {Array}
   */
  adjacent(name1, name2) {
    const joint1 = this.get(name1)
    const joint2 = this.get(name2)

    if(joint1 && joint2) {
      return [
        joint1,
        joint2
      ]
    }

    return []
  }

  /**
   * Find the left and right instance
   * if a key, means if searched for "shoulder"
   * it would return the "leftShoulder" and "rightShoulder"
   * as an array.
   *
   * Special handling for nose, as there is not left/right
   *
   * @param {String} name base name to get left and right for
   * @returns {Array|Undefined}
   */
  findLeftRight(name) {
    if(name === 'nose') {
      return this.get('nose')
    }

    const nname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    const left = this.get('left' + nname)
    const right = this.get('right' + nname)

    if(left && right) {
      return [
        left,
        right
      ]
    }
  }
}

export {
  KeypointStore
}
