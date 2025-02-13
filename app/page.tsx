"use client";
import { detectFaceOnImage, initializeFaceDetector } from "@/libs/faceDetect";
import { FaceDetector } from "@mediapipe/tasks-vision";
import Image from "next/image";
import React, { useEffect } from "react";

export default function Home() {
  const imageRef = React.useRef<HTMLImageElement>(null);
  const [faceDetector, setFaceDetector] = React.useState<FaceDetector | null>(
    null
  );
  const containerRef = React.useRef<HTMLElement | null>(document.getElementById("container"));

  useEffect(() => {
    containerRef.current = document.getElementById("container");
    if (!containerRef.current) {
      console.error("Container not found");
      return;
    }
    initializeFaceDetector(containerRef.current).then((detector) => setFaceDetector(detector));
  }, []);


  const handleClick = async () => {
    if (!containerRef.current) {
      console.error("Container not found");
      return;
    }
    if (!faceDetector) {
      console.error("Face detector not found");
      return;
    }
    if (!imageRef.current) {
      console.error("Image not found");
      return;
    }
    detectFaceOnImage(faceDetector, imageRef.current!);
  };

  return (
    <div id="container" className="">
      <Image
        ref={imageRef}
        src={"/kevin1.jpg"}
        alt="kien-portrait"
        width={500}
        height={500}
      />
      <button onClick={handleClick} className="p-2 border border-black mt-4">
        Click me
      </button>
    </div>
  );
}
