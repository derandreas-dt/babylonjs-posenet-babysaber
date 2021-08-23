
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

/**
 * Create the stage the game will happend
 * draws the quads and connecting lines
 *
 * @param {Scene} scene  BabylonJS Scene
 */
const createStage = (scene) => {
  const sizeFar = 3
  const sizeNear = 15

  const r1 = drawQuad(scene, sizeFar)
  const r2 = drawQuad(scene, sizeNear, sizeNear * -1)
  drawLine(scene, sizeFar, sizeNear, sizeNear * -1)
}

/**
 *
 * @param {Scene} scene
 * @param {Number} s1 Value of "sizeNear" from (0, 0, 0) for the Z axis
 * @param {Number} s2 Value of "sizeFar" from (0, 0, 0) for the Z axis
 * @param {Number} offZ Value for the offset on the Z axis
 */
const drawLine = (scene, s1, s2, offZ) => {
  const line1 = MeshBuilder.CreateLines('l1', {
    points: [
      new Vector3(s1/-2, s1/-2, 0),
      new Vector3(s2/-2, s2/-2, offZ),
    ]
  }, scene, true)
  const line2 = MeshBuilder.CreateLines('l2', {
    points: [
      new Vector3(s1/2, s1/-2, 0),
      new Vector3(s2/2, s2/-2, offZ),
    ]
  }, scene, true)
  const line3 = MeshBuilder.CreateLines('l3', {
    points: [
      new Vector3(s1/2, s1/2, 0),
      new Vector3(s2/2, s2/2, offZ),
    ]
  }, scene, true)
  const line4 = MeshBuilder.CreateLines('l4', {
    points: [
      new Vector3(s1/-2, s1/2, 0),
      new Vector3(s2/-2, s2/2, offZ),
    ]
  }, scene, true)
}

/**
 * Draw the Quad / Rectangle of the game stage
 *
 * @param {Scene} scene BabylonJS Scene
 * @param {Number} size size of the quad in vector space
 * @param {Number} offZ Offset on the Z Axis
 * @returns {Mesh}
 */
const drawQuad = (scene, size=1, offZ=0) => {
  // 0/1  +------+ 1/1
  //      |      |
  //      |      |
  // 0/0  +------+ 1/0

  const quad = MeshBuilder.CreateLines('fquad', {
    points: [
      new Vector3(0, 0, offZ),
      new Vector3(size, 0, offZ),
      new Vector3(size, size, offZ),
      new Vector3(0, size, offZ),
      new Vector3(0, 0, offZ),
    ],
  }, scene)
  quad.position = new Vector3(size / -2, size / -2, 0)

  return quad
}

export {
  createStage
}
