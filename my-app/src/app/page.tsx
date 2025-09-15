"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Image 컴포넌트 계속 사용

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F3F3F3",
    padding: "20px",
    boxSizing: "border-box",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  logoContainer: {
    width: "120px", // 로고 이미지 크기 조절
  },
  studioTextContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px", // 이미지들 사이의 간격
    width: "100%",
  },
  // 이미지 버튼 컨테이너는 그대로 유지
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "15px",
    marginTop: "10px",
  },
  imageButton: {
    cursor: "pointer",
    border: "none",
    background: "none",
    padding: 0,
    width: "100%",
  },
  // 새로운 스타일: 서브 텍스트 이미지를 위한 래퍼
  subTextWrapper: {
    flex: 1, // 이미지들이 공간을 고르게 차지하도록
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "45px", // 피그마 디자인과 유사한 높이 유지
  },
};

const Home = () => {
  const router = useRouter();

  const handleModeSelect = (mode: "camera" | "gallery") => {
    sessionStorage.setItem("photoMode", mode);
    router.push("/selectFrame");
  };

  return (
    <main style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Header Section with the new logo image */}
        <div style={styles.logoContainer}>
          <Image
            src="/image/title.png" // public 폴더 기준 경로
            alt="iYS Logo"
            width={120}
            height={60}
            layout="responsive"
            priority
          />
        </div>

        {/* Text bubbles using the new image assets for "in Your Studio:" */}
        <div style={styles.studioTextContainer}>
          <div style={styles.subTextWrapper}>
            <Image
              src="/image/in.png" // "in" 이미지 경로 (예시)
              alt="in"
              width={80} // 이미지의 실제 너비
              height={45} // 이미지의 실제 높이
              layout="intrinsic" // 이미지 원래 비율 유지
            />
          </div>
          <div style={styles.subTextWrapper}>
            <Image
              src="/image/your.png" // "Your" 이미지 경로 (예시)
              alt="Your"
              width={100} // 이미지의 실제 너비
              height={45} // 이미지의 실제 높이
              layout="intrinsic"
            />
          </div>
          <div style={styles.subTextWrapper}>
            <Image
              src="/image/studio.png" // "Studio:" 이미지 경로 (예시)
              alt="Studio:"
              width={120} // 이미지의 실제 너비
              height={45} // 이미지의 실제 높이
              layout="intrinsic"
            />
          </div>
        </div>

        {/* Button Section (변경 없음) */}
        <div style={styles.buttonContainer}>
          <button
            style={styles.imageButton}
            onClick={() => handleModeSelect("camera")}
          >
            <Image
              src="/image/button1.png"
              alt="Take photos"
              width={500}
              height={300}
              layout="responsive"
              priority
            />
          </button>
          <button
            style={styles.imageButton}
            onClick={() => handleModeSelect("gallery")}
          >
            <Image
              src="/image/button2.png"
              alt="Load photos from gallery"
              width={500}
              height={300}
              layout="responsive"
            />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
