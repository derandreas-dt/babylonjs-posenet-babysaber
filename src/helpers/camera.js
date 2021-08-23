

/**
 * Setup the webcam with the right settings
 * and wait until the webcam stream is ready
 *
 * @param {HTMLElement} video input video element (aka webcam)
 * @param {Number} videoWidth input video width
 * @param {Number} videoHeight input video height
 * @returns {HTMLElement}
 */
const setupCamera = async (video, videoWidth, videoHeight) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }
  video.width = videoWidth
  video.height = videoHeight

  const stream  = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
      width: videoWidth,
      height: videoHeight
    }
  })

  video.srcObject = stream

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      video.play()
      resolve(video)
    }
  })
}

export {
  setupCamera
}
