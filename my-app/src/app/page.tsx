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

const Home = () => {
  const router = useRouter();

  // '사진 촬영' 또는 '갤러리' 선택을 처리하는 함수
  const handleModeSelect = (mode: "camera" | "gallery") => {
    // 어떤 모드를 선택했는지 세션에 저장
    sessionStorage.setItem("photoMode", mode);
    // 프레임 선택 페이지로 이동
    router.push("/selectFrame");
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>바다의 인생네컷</h1>
      </div>
      <div style={styles.contentContainer}>
        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={() => handleModeSelect("camera")}
          >
            사진 촬영하기
          </button>
          <button style={styles.button} onClick={() => handleModeSelect('gallery')}>
            갤러리 불러오기
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
