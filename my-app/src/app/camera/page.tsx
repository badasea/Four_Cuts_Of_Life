"use client";

import Image from "next/image";
import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    padding: "20px",
    boxSizing: "border-box",
  },
  header: {
    position: "absolute",
    top: "20px",
    border: "2px solid black",
    padding: "10px 20px",
    backgroundColor: "white",
  },
  title: {
    margin: 0,
    fontSize: "24px",
  },
  subtitle: {
    margin: "20px 0",
    fontSize: "20px",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "white",
    border: "2px solid black",
    padding: "40px 20px",
    minHeight: "400px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "80%",
  },
  button: {
    padding: "15px",
    fontSize: "18px",
    cursor: "pointer",
    border: "2px solid black",
    backgroundColor: "white",
    width: "100%",
  },
  frameSelectionContainer: {
    display: "flex",
    gap: "30px",
  },
  frameOption: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "20px",
    border: "2px solid black",
    cursor: "pointer",
    backgroundColor: "white",
  },
  frameVisual: {
    display: "grid",
    border: "1px solid #ccc",
  },
  frameBox: {
    width: "30px",
    height: "30px",
    border: "1px solid #ccc",
  },
  webcamContainer: {
    width: "100%",
    maxWidth: "400px",
    aspectRatio: "1 / 1",
    border: "2px solid black",
    position: "relative",
    overflow: "hidden", // 이미지가 컨테이너를 벗어나지 않도록
  },
  captureButton: {
    marginTop: "20px",
    padding: "15px 30px",
    fontSize: "18px",
    cursor: "pointer",
    border: "2px solid black",
    backgroundColor: "white",
  },
};

const Camera = () => {
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
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>바다의 인생네컷</h1>
      </div>
      <div style={styles.contentContainer}>
        <h2 style={styles.subtitle}>사진 촬영</h2>
        <div style={styles.webcamContainer}>
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt="Captured"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user", aspectRatio: 1 }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
        {imgSrc ? (
          <button style={styles.captureButton} onClick={() => setImgSrc(null)}>
            다시 찍기
          </button>
        ) : (
          <button style={styles.captureButton} onClick={capture}>
            사진 찍기
          </button>
        )}
      </div>
    </main>
  );
};

export default Camera;
