"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- 새로운 디자인에 맞춘 스타일 객체 ---
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
  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
    width: "100%",
    padding: "10px",
  },
  photoSelectItem: {
    position: "relative",
    cursor: "pointer",
    border: "4px solid transparent",
    borderRadius: "12px",
    aspectRatio: "1 / 1",
    overflow: "hidden",
  },
  photoSelected: {
    border: "8px solid #FFABA9",
  },
  // --- statusText를 statusContainer로 변경 ---
  statusContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  },
  statusCounterText: {
    fontSize: "16px",
    color: "#555",
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
  primaryButton: {
    flex: 1,
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#E92823",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  secondaryButton: {
    flex: 1,
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#ECECEC",
    color: "#A0A0A0",
    cursor: "pointer",
  },
  disabledButton: {
    backgroundColor: "#ECECEC",
    color: "#A0A0A0",
    cursor: "not-allowed",
  },
};

const PHOTOS_TO_SELECT = 4;

export default function SelectImage() {
  const router = useRouter();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // 비즈니스 로직은 이전과 동일하게 유지
  useEffect(() => {
    const storedImagesJSON = sessionStorage.getItem("capturedImages");
    if (storedImagesJSON) {
      const storedImages = JSON.parse(storedImagesJSON);
      setCapturedImages(storedImages);
    } else {
      alert("촬영된 사진이 없습니다. 사진 촬영 페이지로 이동합니다.");
      router.push("/takePhoto");
    }
  }, [router]);

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

  const handleConfirmSelection = () => {
    sessionStorage.setItem("selectedImages", JSON.stringify(selectedImages));
    router.push("/previewFrame");
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
              src="/image/selectImage/selectImage.png"
              alt="사진 고르기"
              width={150}
              height={40}
              layout="responsive"
            />
          </div>
        </div>
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
        {/* --- 이 부분을 이미지와 텍스트 조합으로 변경 --- */}
        <div style={styles.statusContainer}>
          <Image
            src="/image/selectImage/choice.png"
            alt="사진을 네장 선택해주세요"
            width={247} // 이미지 크기 조절
            height={35} // 이미지 크기 조절
            sizes="100vw"
          />
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button style={styles.secondaryButton} onClick={handleGoToHome}>
          처음으로
        </button>
        <button
          style={{
            ...styles.primaryButton,
            ...(selectedImages.length !== PHOTOS_TO_SELECT
              ? styles.disabledButton
              : {}),
          }}
          disabled={selectedImages.length !== PHOTOS_TO_SELECT}
          onClick={handleConfirmSelection}
        >
          다음
        </button>
      </div>
    </main>
  );
}
