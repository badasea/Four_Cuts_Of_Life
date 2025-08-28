"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 이 페이지에서 사용하는 스타일만 남겼습니다.
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
    border: "3px solid #007bff", // 선택되었을 때 파란색 테두리
  },
};

const PHOTOS_TO_SELECT = 4; // 선택해야 할 사진 수

export default function SelectImage() {
  const router = useRouter();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // 1. 페이지 로드 시 Session Storage에서 촬영된 이미지 불러오기
  useEffect(() => {
    const storedImagesJSON = sessionStorage.getItem("capturedImages");
    if (storedImagesJSON) {
      const storedImages = JSON.parse(storedImagesJSON);
      setCapturedImages(storedImages);
    } else {
      // 촬영된 이미지가 없으면 촬영 페이지로 돌려보내기 (예외 처리)
      alert("촬영된 사진이 없습니다. 사진 촬영 페이지로 이동합니다.");
      router.push("/takePhoto");
    }
  }, [router]);

  // 2. 사진 선택/해제 로직
  const handleToggleSelectImage = (imageSrc: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageSrc)) {
        // 이미 선택된 사진이면 배열에서 제거 (선택 해제)
        return prev.filter((img) => img !== imageSrc);
      } else {
        // 새로 선택하는 사진이면, 4장 미만일 때만 배열에 추가
        if (prev.length < PHOTOS_TO_SELECT) {
          return [...prev, imageSrc];
        }
      }
      // 4장이 이미 꽉 찼으면, 현재 상태를 그대로 반환
      return prev;
    });
  };

  // 3. 선택 완료 로직
  const handleConfirmSelection = () => {
    // 선택된 4장의 이미지를 Session Storage에 저장
    sessionStorage.setItem("selectedImages", JSON.stringify(selectedImages));
    // 최종 미리보기 페이지로 이동
    router.push("/previewFrame");
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>바다의 인생네컷</h1>
      </div>
      <div style={styles.contentContainer}>
        <h2 style={styles.subtitle}>
          사진 고르기 ({selectedImages.length}/{PHOTOS_TO_SELECT})
        </h2>
        <div style={styles.photoGrid}>
          {capturedImages.map((src, index) => (
            <div
              key={index}
              style={
                selectedImages.includes(src)
                  ? { ...styles.photoSelectItem, ...styles.photoSelected }
                  : styles.photoSelectItem
              }
              onClick={() => handleToggleSelectImage(src)}
            >
              <Image
                src={src}
                alt={`captured ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
        <button
          style={{ ...styles.button, marginTop: "20px" }}
          // 정확히 4장을 선택했을 때만 버튼 활성화
          disabled={selectedImages.length !== PHOTOS_TO_SELECT}
          onClick={handleConfirmSelection}
        >
          선택 완료
        </button>
      </div>
    </main>
  );
}
