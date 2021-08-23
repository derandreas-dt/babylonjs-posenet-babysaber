
import { PointerEventTypes } from '@babylonjs/core/Events/pointerEvents'
import { Axis } from '@babylonjs/core/Maths/math.axis'

/**
 * Helper during development to screen freely on
 * a FreeCamera instance. Copied from one of the
 * BabylonJS-Playgrounds, dont have the URL anymore
 *
 * @param {Scene} scene BabylonJS Scene
 */
const addFreeCameraScroll = (scene) => {

  scene.onPrePointerObservable.add((pointerInfo, eventState) => {
    const event = pointerInfo.event
    let delta = 0
    // @ts-ignore
    if (event.wheelDelta) {
      // @ts-ignore
      delta = event.wheelDelta
    } else if (event.detail) {
      delta = -event.detail
    }
    if (delta) {
      const dir = scene.activeCamera.getDirection(Axis.Z)
      if (delta > 0) {
        scene.activeCamera.position.addInPlace(dir)
      } else {
        scene.activeCamera.position.subtractInPlace(dir)
      }
    }
  }, PointerEventTypes.POINTERWHEEL, false)
}

export {
  addFreeCameraScroll
}
