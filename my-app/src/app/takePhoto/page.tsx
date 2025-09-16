"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import Image from "next/image";

// --- 카운트다운 숫자와 이미지 경로를 매핑하는 객체 ---
const countdownImages: { [key: number]: string } = {
  5: "/image/takePhoto/5.png",
  4: "/image/takePhoto/4.png",
  3: "/image/takePhoto/3.png",
  2: "/image/takePhoto/2.png",
  1: "/image/takePhoto/1.png",
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F3F3F3",
    padding: "20px",
    boxSizing: "border-box",
  },
  topContentWrapper: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  logoContainer: {
    width: "80px",
  },
  titleContainer: {
    width: "150px",
  },
  webcamContainer: {
    width: "100%",
    aspectRatio: "1 / 1",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "black",
    borderRadius: "12px",
  },
  crosshair: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "30px",
    height: "30px",
    transform: "translate(-50%, -50%)",
  },
  crosshairHorizontal: {
    position: "absolute",
    top: "50%",
    left: "0",
    right: "0",
    height: "2px",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    transform: "translateY(-50%)",
  },
  crosshairVertical: {
    position: "absolute",
    left: "50%",
    top: "0",
    bottom: "0",
    width: "2px",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    transform: "translateX(-50%)",
  },
  // --- 이 부분 수정 ---
  countdownImageContainer: {
    position: "absolute",
    // top 대신 bottom 기준으로 위치 설정
    bottom: "20px",
    left: "50%",
    // Y축 transform 제거하고 X축만 중앙 정렬
    transform: "translateX(-50%)",
    // 크기 조절
    width: "50px",
    height: "50px",
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
  buttonContainer: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  primaryButton: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#E92823",
    color: "white",
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#ECECEC",
    color: "#A0A0A0",
    cursor: "pointer",
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

  // 비즈니스 로직은 이전과 동일하게 유지
  useEffect(() => {
    const storedFrame = sessionStorage.getItem("selectedFrame");
    if (storedFrame === "1x4" || storedFrame === "2x2") {
      setFrame(storedFrame);
    }
    sessionStorage.removeItem("capturedImages");
  }, []);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImages((prev) => {
          const newImages = [...prev, imageSrc];
          sessionStorage.setItem("capturedImages", JSON.stringify(newImages));
          if (newImages.length >= TOTAL_SHOTS) {
            setIsCapturing(false);
          }
          return newImages;
        });
      }
    }
  }, [webcamRef, router]);

  useEffect(() => {
    if (!isCapturing && capturedImages.length >= TOTAL_SHOTS) {
      router.push("/selectImage");
    }
  }, [isCapturing, capturedImages, router]);

  useEffect(() => {
    if (!isCapturing) return;
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    if (countdown === 0) {
      clearInterval(countdownTimer);
      capture();
      if (capturedImages.length < TOTAL_SHOTS - 1) {
        setTimeout(() => setCountdown(5), 500);
      }
    }
    return () => clearInterval(countdownTimer);
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
      <div style={styles.topContentWrapper}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <Image
              src="/image/title.png"
              alt="iYS Logo"
              width={80}
              height={40}
              layout="responsive"
            />
          </div>
          <div style={styles.titleContainer}>
            <Image
              src="/image/takePhoto/takephoto.png"
              alt="사진 촬영"
              width={150}
              height={40}
              layout="responsive"
            />
          </div>
        </div>

        <div style={styles.webcamContainer}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user", aspectRatio: 1 }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={styles.crosshair}>
            <div style={styles.crosshairVertical}></div>
            <div style={styles.crosshairHorizontal}></div>
          </div>
          {isCapturing && (
            <div style={styles.shotCounter}>
              {capturedImages.length + 1} / {TOTAL_SHOTS}
            </div>
          )}
          {isCapturing && countdown > 0 && countdownImages[countdown] && (
            <div style={styles.countdownImageContainer}>
              <Image
                src={countdownImages[countdown]}
                alt={`Countdown ${countdown}`}
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          )}
        </div>
      </div>

      <div style={styles.buttonContainer}>
        {!isCapturing ? (
          <button style={styles.primaryButton} onClick={handleStartCapture}>
            촬영 시작
          </button>
        ) : (
          <button
            style={{
              ...styles.primaryButton,
              cursor: "not-allowed",
              backgroundColor: "#F08080",
            }}
          >
            촬영 중... ({capturedImages.length + 1} / {TOTAL_SHOTS})
          </button>
        )}
        <button style={styles.secondaryButton} onClick={handleGoToHome}>
          처음으로
        </button>
      </div>
    </main>
  );
}
