"use client";

import Image from "next/image";
import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    // ref.current가 있는지 확인 후 스크린샷 함수 호출
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
      />
      <button onClick={capture}>사진 찍기</button>
      {imgSrc && (
        <Image src={imgSrc} alt="Captured" width={1280} height={720} />
      )}
    </div>
  );
}
