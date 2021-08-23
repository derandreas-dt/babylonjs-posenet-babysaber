import * as posenet from '@tensorflow-models/posenet'
import '@tensorflow/tfjs-backend-webgl'

class Posenet {
  /**
   * Init the posenet class
   *
   * @param {HTMLElement} videoElement the html video element
   * @param {HTMLElement} outputElement output video element
   * @param {Store} store Helper Store
   */
  constructor(videoElement, outputElement, store) {
    this.net = null
    this.outputStride = 16
    this.imageScaleFactor = 0.5
    this.minPoseConfidence = 0.2
    this.minPartConfidence = 0.8
    this.flipHorizontal = true
    this.videoWidth = store.get('videoWidth')
    this.videoHeight = store.get('videoHeight')

    this.video = videoElement
    this.output = outputElement
    this.output.width = this.videoWidth
    this.output.height = this.videoHeight
    this.ctxOutput = this.output.getContext('2d')
    this.ctxOutput.width = this.videoWidth
    this.ctxOutput.height = this.videoHeight

    this.store = store
  }

  /**
   * Load the posnet model
   */
  async load() {
    this.net = await posenet.load()
  }

  /**
   * Run the posenet detection
   * Calls the internal frame detection in an endless loop
   * and stores the result in the helper store so that
   * other modules can work with these values
   */
  async detect() {
    const poseDetectionFrame = async () => {
      let poses = []

      const pose = await this.net.estimateSinglePose(
        this.video,
        this.imageScaleFactor,
        this.flipHorizontal,
        this.outputStride
      )

      poses.push(pose)

      this.ctxOutput.clearRect(0, 0, this.videoWidth, this.videoHeight)
      this.ctxOutput.save()
      // this.ctxOutput.scale(-1, 1)
      // this.ctxOutput.translate(-this.videoWidth, 0)
      this.ctxOutput.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight)
      this.ctxOutput.restore()

      poses.forEach(({ score, keypoints }) => {
        if(score >= this.minPoseConfidence) {
          this.updateStore(keypoints)
          this.drawKeypoints(keypoints)
        } else {
          this.updateStore(keypoints, true)
        }
      })

      requestAnimationFrame(poseDetectionFrame)
    }

    poseDetectionFrame()
  }

  /**
   * Update the detected keypoints in the helper store
   * if reset is true, then the keypoint is reset to 0
   *
   * @param {Array} keypoints detected Posenet keypoints
   * @param {Boolean} reset  if true resets the keypoints, by setting it to 0
   */
  updateStore(keypoints, reset) {
    keypoints.forEach(kp => this.store.set(kp.part, reset ? 0 : kp.position))
  }

  /**
   * Draw a point in the output canvas
   *
   * @param {Number} x x-coord to draw the point
   * @param {Number} y y-coord to draw the point
   * @param {Number} r Radius of the point
   * @param {String} c Color of the point
   */
  drawPoint(x, y, r, c) {
    this.ctxOutput.beginPath()
    this.ctxOutput.arc(x, y, r, 0, 2 * Math.PI)
    this.ctxOutput.fillStyle = c
    this.ctxOutput.fill()
  }

  /**
   * Draw a line in the output canvas
   *
   * @param {Array[Number, Number]} param0 Start x/y point of the line as an array
   * @param {Array[Number, Number]} param1 End x/y point of the line as an array
   * @param {Number} lw Line Width in px
   * @param {String} c Color of the line
   */
  drawLine([ax, ay], [bx, by], lw, c) {
    this.ctxOutput.beginPath()
    this.ctxOutput.moveTo(ax, ay)
    this.ctxOutput.lineTo(bx, by)
    this.ctxOutput.lineWidth = lw
    this.ctxOutput.strokeStyle = c
    this.ctxOutput.stroke()
  }

  /**
   * Draw the detected posenet keypoints in the output canvas
   *
   * @param {Array} keypoints Posenet keypoints
   */
  drawKeypoints(keypoints) {
    for(let i = 0, len = keypoints.length; i < len; ++i) {
      let kp = keypoints[i]

      if(kp.score < this.minPartConfidence) {
        continue
      }

      let { y, x } = kp.position
      this.drawPoint(x, y, 5, 'red')
    }
  }

  /**
   * Draw the detected skeleton in the output canvas
   *
   * @param {Array} keypoints posenet keypoints
   */
  drawSkeleton(keypoints) {
    posenet
      .getAdjacentKeyPoints(keypoints, this.minPartConfidence)
      .forEach(kp => {
        this.drawLine(
          toTuple(kp[0].position),
          toTuple(kp[1].position),
          5,
          'green'
        )
      })
  }
}

/**
 * Get the x/y positions from the posenet keypoint position
 * and return it as an array with x/y
 *
 * @param {Object} param0 keypoint position with x and y props
 * @returns {Array}
 */
const toTuple = ({y, x}) => {
  return [x, y]
}

export {
  Posenet
}
