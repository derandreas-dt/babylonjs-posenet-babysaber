import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Engine } from '@babylonjs/core/Engines/engine'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Scalar } from '@babylonjs/core/Maths/math.scalar'
import { Sound } from '@babylonjs/core/Audio/sound'

import { toggleWorldAxis } from './helpers/axis.js'
import { addFreeCameraScroll } from './helpers/freecamerascroll.js'
import { createStage } from './entities/stage.js'
import { setupCamera } from './helpers/camera.js'
import { drawSkeleton } from './entities/skeleton.js'

import { Animation }  from '@babylonjs/core/Animations/animation'
import { CircleEase, EasingFunction } from '@babylonjs/core/Animations/easing'

import { Posenet } from './helpers/posenet.js'
import { KeypointStore } from './helpers/store.js'

import '@babylonjs/core/Animations/animatable'
import { Color3, GlowLayer, KeyboardEventTypes, StandardMaterial } from '@babylonjs/core'

// import * as GUI from '@babylonjs/gui'
import { AdvancedDynamicTexture } from '@babylonjs/gui'
import { Control } from '@babylonjs/gui/2D/controls/control'
import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock'
import { Rectangle } from '@babylonjs/gui/2D/controls/rectangle'

import { throttle } from './helpers/utils'

const ll = throttle(console.log, 500)

const videoWidth = window.innerWidth
const videoHeight = window.innerHeight
const videoWidthSmall = 800
const videoHeightSmall = 600

/**
 * Create the babylon js scene
 * setup camera and all stuff
 *
 * @param {Store} store Helper store
 * @returns {Scene}
 */
const createScene = (engine, gameCanvas, store) => {
  const scene = new Scene(engine)
  const camera = new ArcRotateCamera('camera', Math.PI/2, Math.PI/2, -20, new Vector3(0, 0, 0), scene)
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)

  const boxHit = new Sound('hit', 'hit28.wav', scene)
  // const bumbleBee = new Sound('bee', 'bumblebee.wav', scene)

  camera.attachControl(gameCanvas)

  scene.onKeyboardObservable.add((kbInfo) => {
    if(kbInfo.type === KeyboardEventTypes.KEYDOWN) {
      const key = kbInfo.event.key

      if(key === 'a') {
        store.set('drawAxis', !store.get('drawAxis'))

        toggleWorldAxis(scene, store.get('drawAxis'))
      }
      if(key === 'o') {
        store.set('drawOutput', !store.get('drawOutput'))
        store.get('outputEl').style.visible = store.get('drawOutput') ? 'visible' : 'hidden'
        store.get('outputEl').style.display = store.get('drawOutput') ? 'block' : 'none'
      }
      if(key === 's') {
        store.set('drawSkeleton', !store.get('drawSkeleton'))
      }
      if(key === 'f') {
        store.set('fullScreen', !store.get('fullScreen'))

        if(store.get('fullScreen')) {
          store.set('videoWidth', 800)
          store.set('videoHeight', 600)
          gameCanvas.width = window.innerWidth
          gameCanvas.height = window.innerHeight
        } else {
          gameCanvas.width = videoWidthSmall
          gameCanvas.height = videoHeightSmall
        }
      }
    }
  })

  createStage(scene)
  addFreeCameraScroll(scene)
  drawSkeleton(scene, store, camera)

  const colors = [
    new Color3(0,0,1),
    new Color3(1,0,0),
    new Color3(0,1,0),
    new Color3(1,1,0),
    new Color3(0,1,1),
    new Color3(1,0,1),
  ]

  var gl = new GlowLayer('glow', scene)
  gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
      if (mesh.name === 'box1') {
        // result.set(1, 0, 1, 1)
        result.copyFrom(mesh.material['emissiveColor'].clone().toColor4(1))
      } else if(mesh.name === 'leftBox' || mesh.name === 'rightBox') {
        result.set(1, 1, 1, 1)
      } else {
        result.set(0, 0, 0, 0)
      }
  }

  // GUI stuff

  const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI')

  const rect1 = new Rectangle()
  rect1.width = 0.2
  rect1.height = '40px'
  rect1.color = 'black'
  rect1.thickness = 0
  rect1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
  rect1.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
  rect1.top = '0px'
  rect1.left = '0px'

  const text1 = new TextBlock('score')
  text1.text = 'Score 0'
  text1.color = 'white'
  text1.fontSize = 24
  rect1.addControl(text1)

  advancedTexture.addControl(rect1)

  // window.setInterval(() => {
  const createEnemyBox = () => {
    const box = MeshBuilder.CreateBox('box1', {
      width: 1,
      height: 1,
      depth: 1,
    }, scene)
    box.position = new Vector3(0, 0, 0)
    box.scaling = new Vector3(0, 0, 0)

    var materialforbox = new StandardMaterial('texture1', scene)
    materialforbox.emissiveColor = colors[Math.floor(Math.random()*colors.length)].clone()

    box.material = materialforbox

    // const boxSound = bumbleBee.clone()
    // boxSound.updateOptions({
    //   maxDistance: 1000,
    //   refDistance: 500
    // })
    // boxSound.setVolume(0.6)
    // boxSound.attachToMesh(box)
    // boxSound.play()

    var whereto = new Vector3(Scalar.RandomRange(-3, 3), Scalar.RandomRange(-3, 3), -15)
    const scaleTo = new Vector3(1, 1, 1)
    const easingFunction = new CircleEase()
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEIN)
    Animation.CreateAndStartAnimation('anim', box, 'position', 10, 120, box.position, whereto, Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction)
    Animation.CreateAndStartAnimation('anim', box, 'scaling', 10, 120, box.scaling, scaleTo, Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction)


    scene.registerBeforeRender(() => {
      const leftBox = store.get('leftBox')
      const rightBox = store.get('rightBox')

      if(!box['isAlreadyHit'] && (box.intersectsMesh(leftBox) || box.intersectsMesh(rightBox))) {
        store.set('score', store.get('score') + 1)
        text1.text = 'Score ' + store.get('score')
        boxHit.play()
        box['isAlreadyHit'] = true
        box.setEnabled(false)
        box.isVisible = false
        // boxSound.stop()
        box.dispose()
      }

      if(box.position.z < -14) {
        box.setEnabled(false)
        // boxSound.stop()
        box.dispose()
      }
    })
  }

  (function createRandomEnemies() {
    var rand = Math.round(Math.random() * (5000 - 500)) + 500
    setTimeout(function() {
      createEnemyBox()
      createRandomEnemies()
    }, rand)
  }())

  return scene
}

/**
 * Main Game call to start off everything
 */
(async () => {
  try {
    const elOutput = document.querySelector('#output')
    const elCamera = document.querySelector('#camera')
    const video = await setupCamera(elCamera, videoWidthSmall, videoHeightSmall)

    const store = new KeypointStore()
    store.set('outputEl', elOutput)
    store.set('cameraEl', elCamera)
    store.set('videoWidth', videoWidthSmall)
    store.set('videoHeight', videoHeightSmall)
    store.set('drawAxis', false)
    store.set('drawOutput', false)
    store.set('drawSkeleton', false)
    store.set('fullScreen', true)
    store.set('score', 0)

    const pose = new Posenet(video, elOutput, store)
    await pose.load()
    pose.detect()

    const gameCanvas = document.getElementById('view') as HTMLCanvasElement
    gameCanvas.width = videoWidth
    gameCanvas.height = videoHeight

    const engine = new Engine(gameCanvas, true)
    const scene = createScene(engine, gameCanvas, store)
    engine.runRenderLoop(() => {
        scene.render()
    })
  } catch (e) {
      // Deal with the fact the chain failed
  }
})();
