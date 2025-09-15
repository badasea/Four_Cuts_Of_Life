"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Next.js Image 컴포넌트 사용

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F3F3F3", // 피그마 디자인에 더 가까운 배경색
    padding: "20px",
    boxSizing: "border-box",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "400px", // 이전 페이지와 일관된 최대 너비
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px", // 요소들 간의 간격 조정
    paddingTop: "20px", // 상단 여백 추가
  },
  logoContainer: {
    width: "120px", // 로고 이미지 크기 조절 (이전 페이지와 동일)
  },
  // "프레임 선택" 타이틀 이미지를 위한 컨테이너
  selectFrameTitleContainer: {
    width: "200px", // "프레임 선택" 이미지 너비에 맞춰 조절
    height: "50px", // "프레임 선택" 이미지 높이에 맞춰 조절
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  frameSelectionContainer: {
    display: "flex",
    gap: "30px", // 프레임 옵션들 간의 간격
    marginTop: "20px", // "프레임 선택" 타이틀과 프레임 옵션 사이 간격
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
    borderRadius: "10px", // 프레임 옵션 박스 모서리 둥글게
    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)", // 그림자 추가
  },
  frameVisual: {
    display: "grid",
    border: "1px solid #ccc",
  },
  frameBox: {
    width: "30px",
    height: "30px",
    border: "1px solid #ccc",
    backgroundColor: "#eee", // 프레임 박스 내부 색상
  },
};

const SelectFrame = () => {
  const router = useRouter();

  const handleSelectFrame = (frameType: "1x4" | "2x2") => {
    sessionStorage.setItem("selectedFrame", frameType);
    const mode = sessionStorage.getItem("photoMode");

    if (mode === "camera") {
      router.push("/takePhoto");
    } else if (mode === "gallery") {
      router.push("/selectFromGallery");
    } else {
      alert("모드를 선택하지 않았습니다. 홈으로 이동합니다.");
      router.push("/");
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Header Section with the logo image */}
        <div style={styles.logoContainer}>
          <Image
            src="/image/title.png" // public 폴더 기준 경로 (이전 페이지와 동일)
            alt="iYS Logo"
            width={120}
            height={60}
            layout="responsive"
            priority
          />
        </div>

        {/* "프레임 선택" 타이틀 이미지를 위한 컨테이너 */}
        <div style={styles.selectFrameTitleContainer}>
          <Image
            src="/image/selectFrame/selectFrame.png" // "프레임 선택" 이미지 경로 (가칭)
            alt="프레임 선택"
            width={200} // 이미지의 실제 너비
            height={50} // 이미지의 실제 높이
            layout="intrinsic"
          />
        </div>

        {/* 기존 프레임 선택 옵션 */}
        <div style={styles.frameSelectionContainer}>
          {/* 1x4 프레임 옵션 */}
          <div
            style={styles.frameOption}
            onClick={() => handleSelectFrame("1x4")}
          >
            <div
              style={{
                ...styles.frameVisual,
                gridTemplateRows: "repeat(4, 1fr)",
                gap: "2px",
                width: "32px",
                height: "134px",
              }}
            >
              <div style={styles.frameBox}></div>
              <div style={styles.frameBox}></div>
              <div style={styles.frameBox}></div>
              <div style={styles.frameBox}></div>
            </div>
            <p>1x4</p>
          </div>
          {/* 2x2 프레임 옵션 */}
          <div
            style={styles.frameOption}
            onClick={() => handleSelectFrame("2x2")}
          >
            <div
              style={{
                ...styles.frameVisual,
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "2px",
                width: "64px",
                height: "64px",
              }}
            >
              <div style={styles.frameBox}></div>
              <div style={styles.frameBox}></div>
              <div style={styles.frameBox}></div>
              <div style={styles.frameBox}></div>
            </div>
            <p>2x2</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SelectFrame;
