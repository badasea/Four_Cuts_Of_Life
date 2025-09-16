"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  contentWrapper: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
    paddingTop: "20px",
  },
  logoContainer: {
    width: "120px",
  },
  selectFrameTitleContainer: {
    width: "200px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  // --- 이 부분 수정 ---
  frameSelectionContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    // 세로 정렬을 다시 '상단'으로 변경
    alignItems: "flex-start",
    width: "100%",
  },
  // --- 이 부분 수정 ---
  frameOption: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    cursor: "pointer",
    // 가장 긴 1x4 프레임의 높이에 맞춰 최소 높이 설정
    minHeight: "280px",
  },
  selectedFrameImageContainer: {
    boxShadow: "0 0 0 10px #FFABA9",
    borderRadius: "4px",
  },
  frameImageContainer: {
    position: "relative",
    width: "60px",
    borderRadius: "10px",
    transition: "box-shadow 0.2s ease",
    overflow: "hidden",
  },
  // --- 이 부분 수정 ---
  frameLabelContainer: {
    position: "relative",
    height: "25px",
    width: "40px",
    // 라벨을 부모 컨테이너의 하단으로 밀어내는 속성 다시 추가
    marginTop: "auto",
  },
  buttonWrapper: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px 0",
  },
  nextButton: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "background-color 0.2s ease",
  },
  activeButton: {
    backgroundColor: "#E92823",
    color: "white",
    cursor: "pointer",
  },
  disabledButton: {
    backgroundColor: "#ECECEC",
    color: "#A0A0A0",
    cursor: "not-allowed",
  },
};

const SelectFrame = () => {
  const router = useRouter();
  const [selectedFrame, setSelectedFrame] = useState<"1x4" | "2x2" | null>(
    null
  );

  const handleNextClick = () => {
    if (!selectedFrame) {
      alert("프레임을 선택해주세요.");
      return;
    }
    sessionStorage.setItem("selectedFrame", selectedFrame);
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
        <div style={styles.logoContainer}>
          <Image
            src="/image/title.png"
            alt="iYS Logo"
            width={120}
            height={60}
            layout="responsive"
            priority
          />
        </div>
        <div style={styles.selectFrameTitleContainer}>
          <Image
            src="/image/selectFrame/selectFrame.png"
            alt="프레임 선택"
            width={200}
            height={50}
            layout="intrinsic"
          />
        </div>
        <div style={styles.frameSelectionContainer}>
          {/* 1x4 프레임 옵션 */}
          <div
            style={styles.frameOption}
            onClick={() => setSelectedFrame("1x4")}
          >
            <div
              style={{
                ...styles.frameImageContainer,
                height: "240px",
                ...(selectedFrame === "1x4"
                  ? styles.selectedFrameImageContainer
                  : {}),
              }}
            >
              <Image
                src="/image/selectFrame/1.png"
                alt="1x4 frame"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div style={styles.frameLabelContainer}>
              <Image
                src="/image/selectFrame/1 x 4.png"
                alt="1x4 label"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>

          {/* 2x2 프레임 옵션 */}
          <div
            style={styles.frameOption}
            onClick={() => setSelectedFrame("2x2")}
          >
            <div
              style={{
                height: "20px",
              }}
            ></div>
            <div
              style={{
                ...styles.frameImageContainer,
                width: "150px",
                height: "180px",
                ...(selectedFrame === "2x2"
                  ? styles.selectedFrameImageContainer
                  : {}),
              }}
            >
              <Image
                src="/image/selectFrame/2.png"
                alt="2x2 frame"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div style={styles.frameLabelContainer}>
              <Image
                src="/image/selectFrame/2 x 2.png"
                alt="2x2 label"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      </div>
      <div style={styles.buttonWrapper}>
        <button
          style={{
            ...styles.nextButton,
            ...(selectedFrame ? styles.activeButton : styles.disabledButton),
          }}
          onClick={handleNextClick}
          disabled={!selectedFrame}
        >
          다음
        </button>
      </div>
    </main>
  );
};

export default SelectFrame;
