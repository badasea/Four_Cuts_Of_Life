"use client";

import Image from "next/image";
import React, { useRef, useCallback, useState, useEffect } from "react";
import Webcam from "react-webcam";
import PreviewFrameForm from "./@components/PreviewFrame";

// 간단한 스타일 객체 (일부 스타일 추가)
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
    fontFamily: "sans-serif",
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
    position: "relative",
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
  // ... 기존 스타일 생략 ...
  webcamContainer: {
    width: "100%",
    maxWidth: "400px",
    aspectRatio: "1 / 1",
    border: "2px solid black",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "black",
  },
  countdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10rem",
    color: "white",
    textShadow: "0 0 15px rgba(0,0,0,0.7)",
  },
  shotCounter: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "16px",
  },
  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    width: "100%",
    maxWidth: "400px",
  },
  photoSelectItem: {
    position: "relative",
    cursor: "pointer",
    border: "3px solid transparent",
    aspectRatio: "1 / 1",
  },
  photoSelected: {
    border: "3px solid #007bff",
  },
  previewFrame: {
    display: "flex",
    border: "2px solid black",
    padding: "10px",
    backgroundColor: "#eee",
  },
};

const TOTAL_SHOTS = 6; // 총 촬영할 사진 수
const PHOTOS_TO_SELECT = 4; // 선택해야 할 사진 수

export default function PreviewFrame() {
  const [step, setStep] = useState<number>(1);
  const [frame, setFrame] = useState<"1x4" | "2x2" | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);

  // --- 촬영 로직 ---
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImages((prev) => [...prev, imageSrc]);
      }
    }
  }, [webcamRef]);

  useEffect(() => {
    if (!isCapturing) return;

    // 모든 샷을 촬영했으면 선택 화면으로 이동
    if (capturedImages.length >= TOTAL_SHOTS) {
      setIsCapturing(false);
      setStep(5);
      return;
    }

    // 카운트다운 로직
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(countdownTimer);
      capture(); // 사진 촬영
      setTimeout(() => setCountdown(5), 500); // 다음 샷 준비
    }

    return () => clearInterval(countdownTimer);
  }, [isCapturing, countdown, capturedImages, capture]);

  const handleStartCapture = () => {
    setCapturedImages([]);
    setSelectedImages([]);
    setIsCapturing(true);
    setCountdown(5); // 5초 카운트다운 시작
  };

  // --- 사진 선택 로직 ---
  const handleToggleSelectImage = (imageSrc: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageSrc)) {
        return prev.filter((img) => img !== imageSrc);
      } else {
        if (prev.length < PHOTOS_TO_SELECT) {
          return [...prev, imageSrc];
        }
      }
      return prev;
    });
  };

  // --- 화면 이동 함수 ---
  const resetAndGoToStep = (stepNum: number) => {
    setIsCapturing(false);
    setCapturedImages([]);
    setSelectedImages([]);
    setStep(stepNum);
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>바다의 인생네컷</h1>
      </div>
      <div style={styles.contentContainer}>
        <PreviewFrameForm
          frame={frame!} // '1x4' 또는 '2x2' 상태
          selectedImages={selectedImages} // 선택된 이미지 배열
          onRetake={() => setStep(5)} // '다시 고르기' -> 5번 스텝으로
          onConfirm={() => alert("프로젝트 완성!")} // '확정' 기능
        />
      </div>
    </main>
  );
}
