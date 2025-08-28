"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

// 스타일 객체는 이전과 동일합니다.
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
  button: {
    padding: "15px",
    fontSize: "18px",
    cursor: "pointer",
    border: "2px solid black",
    backgroundColor: "white",
    width: "100%",
  },
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
};

const TOTAL_SHOTS = 6;

export default function TakePhoto() {
  const [frame, setFrame] = useState<"1x4" | "2x2" | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const router = useRouter();

  // 페이지가 처음 로드될 때 Session Storage에서 프레임 정보를 불러옵니다.
  useEffect(() => {
    const storedFrame = sessionStorage.getItem("selectedFrame");
    if (storedFrame === "1x4" || storedFrame === "2x2") {
      setFrame(storedFrame);
    }
    // 페이지 진입 시 이전 촬영 기록은 삭제합니다.
    sessionStorage.removeItem("capturedImages");
  }, []);

  // --- 촬영 로직 (수정됨) ---
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImages((prev) => {
          const newImages = [...prev, imageSrc];
          sessionStorage.setItem("capturedImages", JSON.stringify(newImages));

          // ✨ 역할 변경: 모든 사진을 촬영했는지 여기서 최종 확인합니다.
          if (newImages.length >= TOTAL_SHOTS) {
            setIsCapturing(false); // 촬영 프로세스를 중단시킵니다.
          }

          return newImages;
        });
      }
    }
  }, [webcamRef, router]);

  useEffect(() => {
    // 촬영이 중단되었고, 사진이 6장 모두 준비되었을 때만 실행
    if (!isCapturing && capturedImages.length >= TOTAL_SHOTS) {
      // 모든 렌더링이 끝난 후 안전하게 페이지 이동
      router.push("/selectImage");
    }
  }, [isCapturing, capturedImages, router]);

  // --- 타이머 로직 (수정됨) ---
  useEffect(() => {
    // 촬영 중 상태가 아니면 타이머 로직을 실행하지 않습니다.
    if (!isCapturing) return;

    // 카운트다운 타이머를 설정합니다.
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // 카운트다운이 0이 되면 사진을 찍고, 다음 촬영을 위해 타이머를 리셋합니다.
    if (countdown === 0) {
      clearInterval(countdownTimer);
      capture();

      // 마지막 촬영 직후에는 카운트다운을 리셋할 필요가 없습니다.
      if (capturedImages.length < TOTAL_SHOTS - 1) {
        setTimeout(() => setCountdown(5), 500);
      }
    }

    // 클린업 함수: 이 useEffect가 다시 실행되기 전에 항상 이전 타이머를 정리합니다.
    return () => clearInterval(countdownTimer);

    // ✨ 역할 변경: 의존성 배열에서 capturedImages.length를 제거하여 불필요한 재실행을 막습니다.
  }, [isCapturing, countdown, capture]);

  const handleStartCapture = () => {
    setCapturedImages([]);
    sessionStorage.removeItem("capturedImages");
    setIsCapturing(true);
    setCountdown(5);
  };

  const handleGoToHome = () => {
    router.push("/");
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>바다의 인생네컷</h1>
      </div>
      <div style={styles.contentContainer}>
        <h2 style={styles.subtitle}>사진 촬영</h2>
        <div style={styles.webcamContainer}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user", aspectRatio: 1 }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {isCapturing && (
            <div style={styles.shotCounter}>
              {/* 사용자가 보기 편하도록 +1을 해줍니다. */}
              {capturedImages.length + 1} / {TOTAL_SHOTS}
            </div>
          )}
          {isCapturing && countdown > 0 && (
            <div style={styles.countdownOverlay}>{countdown}</div>
          )}
        </div>
        {!isCapturing ? (
          <button style={styles.button} onClick={handleStartCapture}>
            촬영 시작 ({TOTAL_SHOTS}장)
          </button>
        ) : (
          <p style={{ marginTop: "20px" }}>촬영 중입니다...</p>
        )}
        <button
          style={{
            ...styles.button,
            backgroundColor: "#eee",
            marginTop: "10px",
          }}
          onClick={handleGoToHome}
        >
          처음으로
        </button>
      </div>
    </main>
  );
}
