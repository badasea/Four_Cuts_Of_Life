"use client";

import React from "react";
import { useRouter } from "next/navigation";

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

const SelectFrame = () => {
  const router = useRouter();

  const handleSelectFrame = (frameType: "1x4" | "2x2") => {
    // 1. 선택한 프레임 정보 저장
    sessionStorage.setItem("selectedFrame", frameType);

    // 2. 어떤 모드였는지 세션에서 확인
    const mode = sessionStorage.getItem("photoMode");

    // 3. 모드에 따라 다른 페이지로 이동
    if (mode === "camera") {
      router.push("/takePhoto");
    } else if (mode === "gallery") {
      router.push("/selectFromGallery");
    } else {
      // 예외 처리
      alert("모드를 선택하지 않았습니다. 홈으로 이동합니다.");
      router.push("/");
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>바다의 인생네컷</h1>
      </div>
      <div style={styles.contentContainer}>
        <h2 style={styles.subtitle}>프레임 선택</h2>
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
