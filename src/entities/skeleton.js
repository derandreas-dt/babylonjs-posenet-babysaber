

import { Camera, MeshBuilder, Scene } from '@babylonjs/core'
import { Matrix, Vector3 } from '@babylonjs/core/Maths/math.vector'
import { throttle } from '../helpers/utils'

const ll = throttle(console.log, 500)
const ll2 = throttle(console.log, 500)
const refVector = new Vector3.Zero()

// WORKAROUND FOR pxToVector gameCanvas reference calc
let videoWidth = 800
let videoHeight = 600

/**
 * Draw the skeleton on the screen
 *
 * This transforms the 2d-posenet pixel positions into
 * 3d Vector3 positions and scales the skeleton to almost
 * the same position, no matter how far or near the person
 * is away from the camera.
 *
 * @param {Scene} scene BabyloneJS Scene
 * @param {Store} store Helper store
 * @param {Camera} cam BabyloneJS Camera
 */
const drawSkeleton = (scene, store, cam) => {
  const tx = 100 // px of shoulder width (for scale calc)
  const ty = 150 // px of spline length (for scale calc)

  store.set('scale', refVector.clone())
  videoWidth = store.get('videoWidth')
  videoHeight = store.get('videoHeight')

  scene.registerBeforeRender(() => {
    // pull some points to calc scale and spline
    const [shoulder1, shoulder2] = store.adjacent('leftShoulder', 'rightShoulder')
    const [hip1, hip2] = store.adjacent('leftHip', 'rightHip')
    // calc the scale to target
    store.set('scale', getScale(tx, ty, shoulder1, shoulder2, hip1, hip2, scene, cam))
    // special spline drawing
    MeshBuilder.CreateLines(null, {
      points: getSplinePoints(shoulder1, shoulder2, hip1, hip2),
      instance: getEntity(scene, store, 'spline')
    })

    drawLine(scene, store, 'shoulders', 'leftShoulder', 'rightShoulder')
    drawLine(scene, store, 'basin', 'leftHip', 'rightHip')

    drawLine(scene, store, 'leftupperarm', 'leftShoulder', 'leftElbow')
    drawLine(scene, store, 'leftforearm', 'leftElbow', 'leftWrist')
    drawLine(scene, store, 'rightupperarm', 'rightShoulder', 'rightElbow')
    drawLine(scene, store, 'rightforearm', 'rightElbow', 'rightWrist')

    drawLine(scene, store, 'leftupperleg', 'leftHip', 'leftKnee')
    drawLine(scene, store, 'leftlowerleg', 'leftKnee', 'leftAnkle')
    drawLine(scene, store, 'rightupperleg', 'rightHip', 'rightKnee')
    drawLine(scene, store, 'rightlowerleg', 'rightKnee', 'rightAnkle')

    // draw boxes at wrists position
    const leftBox = getEntity(scene, store, 'leftBox', true)
    const rightBox = getEntity(scene, store, 'rightBox', true)
    const [leftWrist, rightWrist] = store.adjacent('leftWrist', 'rightWrist')
    if(leftWrist && rightWrist) {
      leftBox.position = pxToVector3(leftWrist.x, leftWrist.y).multiply(store.get('scale'))
      rightBox.position = pxToVector3(rightWrist.x, rightWrist.y).multiply(store.get('scale'))
    }
  })
}

/**
 * Calculate the scaling vector by using shoulders and hip positions
 *
 * The shoulders should span "tx" (100px) on the 3d babylons js screen
 * and the splines should be "ty" (tx*1.5) length on the screen.
 *
 * @param {Number} tx The target x scale reference between shoulders
 * @param {Number} ty The target y scale reference between shoulders and hips
 * @param {Object} shoulder1 Posenet position of the left shoulder
 * @param {Object} shoulder2 Posenet position of the right shoulder
 * @param {Object} hip1 Posenet position of the left hip
 * @param {Object} hip2 Posenet position of the right hip
 * @param {Scene} scene
 * @param {Camera} cam
 * @returns {Vector3}
 */
const getScale = (tx, ty, shoulder1, shoulder2, hip1, hip2, scene, cam) => {
  const engine = scene.getEngine()
  const stm = scene.getTransformMatrix()
  const camvp = cam.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
  const mident = Matrix.Identity()

  const sps = getPoints(shoulder1, shoulder2)
  const hps = getPoints(hip1, hip2)
  const s1 = Vector3.Project(sps[0], mident, stm, camvp)
  const s2 = Vector3.Project(sps[1], mident, stm, camvp)
  const h2 = Vector3.Project(hps[1], mident, stm, camvp)
  const dx = s1.subtract(s2)
  const dy = s1.subtract(h2)

  return new Vector3(
    Math.abs(tx / dx.x),
    Math.abs(ty / dy.y),
    1
  )
}

/**
 * Get the entity name from the store by refName
 * If the entity (Mesh) does not exists, then create it
 * and store it in the Store
 *
 * @param {Scene} scene BabylonJS Scene
 * @param {Store} store helper store to get the joints
 * @param {String} refName Line reference name
 * @param {Boolean} isBox true if returned new entity should be a box or not
 * @returns {Mesh}
 */
const getEntity = (scene, store, refName, isBox=false) => {
  const scale = store.get('scale')
  let entity = store.get(refName)
  if(!entity) {
    if(isBox) {
      entity = MeshBuilder.CreateBox(refName, {
        size: 0.5,
        updatable: true
      }, scene)
      entity.visibility = 0.4
      entity.position = refVector
      // entity.scaling = scale.clone()
    } else {
      entity = MeshBuilder.CreateLines(refName, {
        points: [
          refVector,
          refVector
        ],
        updatable: true
      }, scene)
      entity.scaling = scale.clone()
    }

    store.set(refName, entity)
  }

  if(!isBox) {
    entity.scaling = scale.clone()
    entity.setEnabled(store.get('drawSkeleton'))
  }

  return entity
}

/**
 * Draw a BabylonJS Line between the two joints
 *
 * @param {Scene} scene BabylonJS Scene
 * @param {Store} store helper store to get the joints
 * @param {String} refName Line reference name
 * @param {String} jName0 Name of the first joint to connects from/to
 * @param {String} jName1 Name of the second joint to connects from/to
 */
const drawLine = (scene, store, refName, jName0, jName1) => {
  const [joint0, joint1] = store.adjacent(jName0, jName1)

  MeshBuilder.CreateLines(null, {
    points: getPoints(joint0, joint1),
    instance: getEntity(scene, store, refName)
  })
}

/**
 * Calculate the Vector 3 positions between the
 * two given joint posenet positions
 *
 * @param {Object} joint0 Posenet position of the first joint point
 * @param {Object} joint1 Posenet position of the second joint point
 * @returns {Array[Vector3, Vector3]}
 */
const getPoints = (joint0, joint1) => {
  if(!joint0 || !joint1) {
    return [
      refVector,
      refVector
    ]
  }
  return [
    pxToVector3(joint0.x, joint0.y),
    pxToVector3(joint1.x, joint1.y),
  ]
}

/**
 * Calculate the points of the spline,
 * which is from the center of the shoulder points
 * to the center of the hip points
 *
 * @param {Object} s1 Posenet position of shoulder left
 * @param {Object} s2 Posenet position of shoulder right
 * @param {Object} h1 Posenet position of hip left
 * @param {Object} h2 Posenet position of hip right
 * @returns {Array[Vector3, Vector3]}
 */
const getSplinePoints = (s1, s2, h1, h2) => {
  if(!s1 || !s2 || !h1 || !h2) {
    return getPoints()
  }

  return [
    pxToVector3(s1.x + (s2.x - s1.x)  / 2, s1.y + (s2.y - s1.y)  / 2),
    pxToVector3(h1.x + (h2.x - h1.x)  / 2, h1.y + (h2.y - h1.y)  / 2)
  ]
}

/**
 * Calculate a x/y pixel to a Vector3
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {Vector3}
 */
const pxToVector3 = (x, y, z=-8) => {
  return new Vector3(
    0.5 + (1 - x) / videoWidth,
    0.5 + (1 - y) / videoHeight,
    z
  )
}


export {
  drawSkeleton
}
