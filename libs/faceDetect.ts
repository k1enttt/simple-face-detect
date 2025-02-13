import {
  Detection,
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

// Initialize the object detector
export const initializeFaceDetector = async (detectSection: HTMLElement) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  const faceDetector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
      delegate: "GPU",
    },
    runningMode: "IMAGE",
  });

  detectSection.classList.remove("invisible");
  return faceDetector;
};

/** Detect the face and draw highlight on it */
export const detectFaceOnImage = async (
  faceDetector: FaceDetector | null,
  image: HTMLImageElement
) => {
  // Remove previous highlighters and infos
  const highlighters = (
    image.parentNode as HTMLElement
  )?.getElementsByClassName("highlighter");
  while (highlighters[0]) {
    highlighters[0].parentNode?.removeChild(highlighters[0]);
  }

  const infos = (image.parentNode as HTMLElement)?.getElementsByClassName(
    "info"
  );
  while (infos[0]) {
    infos[0].parentNode?.removeChild(infos[0]);
  }

  if (!faceDetector) {
    console.log("Wait for objectDetector to load before clicking");
    return;
  }

  // const ratio = image.height / image.naturalHeight;

  // faceDetector.detect returns a promise which, when resolved, is an array of Detection faces
  const detections = faceDetector.detect(image).detections;
  console.log(detections);

  displayImageDetections(detections, image);

  return detections;
};

const displayImageDetections = (
  detections: Detection[],
  resultElement: HTMLImageElement
) => {
  const ratio = resultElement.height / resultElement.naturalHeight;
  console.log(ratio);

  for (const detection of detections) {
    // Description text
    const p = document.createElement("p");
    p.setAttribute("class", "info");
    p.innerText =
      "Confidence: " +
      Math.round(parseFloat(detection.categories[0].score.toString()) * 100) +
      "% .";

    // Positioned at the top left of the bounding box.
    // Height is whatever the text takes up.
    // Width subtracts text padding in CSS so fits perfectly.
    const boxOriginX = detection.boundingBox?.originX ?? 0;
    const boxOriginY = detection.boundingBox?.originY ?? 0;
    const boxWidth = detection.boundingBox?.width ?? 0;
    const boxHeight = detection.boundingBox?.height ?? 0;
    p.style =
      "left: " +
      boxOriginX * ratio +
      "px;" +
      "top: " +
      (boxOriginY * ratio - 30) +
      "px; " +
      "width: " +
      (boxWidth * ratio - 10) +
      "px;" +
      "hight: " +
      20 +
      "px;";

    const highlighter = document.createElement("div");
    highlighter.setAttribute("class", "highlighter");
    highlighter.style =
      "left: " +
      boxOriginX * ratio +
      "px;" +
      "top: " +
      boxOriginY * ratio +
      "px;" +
      "width: " +
      boxWidth * ratio +
      "px;" +
      "height: " +
      boxHeight * ratio +
      "px;";

    resultElement.parentNode?.appendChild(highlighter);
    resultElement.parentNode?.appendChild(p);
  }
};
