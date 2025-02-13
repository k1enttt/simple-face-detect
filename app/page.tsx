"use client";
import { detectFaceOnImage, initializeFaceDetector } from "@/libs/faceDetect";
import { FaceDetector } from "@mediapipe/tasks-vision";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [faceDetector, setFaceDetector] = useState<FaceDetector | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Initialize the face detector
    if (!containerRef.current) {
      console.error("Container not found");
      return;
    }
    initializeFaceDetector(containerRef.current).then((detector) =>
      setFaceDetector(detector)
    );
  }, []);

  /** Handle detecting face in the image */
  const handleDetecting = async () => {
    if (!faceDetector) {
      console.error("Face detector not found");
      return;
    }
    if (!imageRef.current) {
      console.error("Image not found");
      return;
    }
    if (!imageSrc) {
      console.error("Image source not found");
      return;
    }
    detectFaceOnImage(faceDetector, imageRef.current);
  };

  /** Handle uploading image from your device */
  const handleUploading = () => {
    const file = inputRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (!imageRef.current) {
          console.error("Image not found");
          return;
        }

        setImageSrc(
          (reader.result as string).replace("data:image/jpeg;base64,:", "")
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div ref={containerRef} id="container" className="relative">
      <button
        onClick={handleDetecting}
        className="p-2 border border-black mt-4"
      >
        Detect face
      </button>
      <label htmlFor="inputImage" className="p-2 border border-black mt-4">
        Upload image
      </label>
      <input
        id="inputImage"
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleUploading}
      />
      <div className="relative">
        <Image
          ref={imageRef}
          src={imageSrc || ""}
          alt="kien-portrait"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
