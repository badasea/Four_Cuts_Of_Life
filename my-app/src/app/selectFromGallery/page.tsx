"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
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
  slot: {
    width: "100%",
    aspectRatio: "1 / 1",
    backgroundColor: "#EAEAEA",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  plusIcon: {
    fontSize: "50px",
    color: "#B0B0B0",
    fontWeight: "300",
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

const TOTAL_SLOTS = 4;
const MAX_WIDTH_OR_HEIGHT = 800;

export default function SelectFromGallery() {
  const router = useRouter();
  // --- 기존 비즈니스 로직 (State, Ref) - 변경 없음 ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<(string | null)[]>(
    Array(TOTAL_SLOTS).fill(null)
  );
  const [currentSlot, setCurrentSlot] = useState<number | null>(null);

  // --- 기존 비즈니스 로직 (useEffect, 핸들러) - 변경 없음 ---
  useEffect(() => {
    if (!sessionStorage.getItem("selectedFrame")) {
      alert("프레임이 선택되지 않았습니다. 이전 페이지로 돌아갑니다.");
      router.push("/selectFrame");
    }
  }, [router]);

  const handleSlotClick = (index: number) => {
    setCurrentSlot(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || currentSlot === null) return;
    try {
      const resizedImage = await resizeImage(file);
      const newImages = [...images];
      newImages[currentSlot] = resizedImage;
      setImages(newImages);
    } catch (error) {
      console.error(error);
      alert("이미지 처리 중 오류가 발생했습니다.");
    }
    event.target.value = "";
  };

  const handleConfirm = () => {
    const finalImages = images.filter((img) => img !== null) as string[];
    // 4장이 채워졌는지 한번 더 확인
    if (finalImages.length !== TOTAL_SLOTS) {
      alert("4장의 사진을 모두 채워주세요.");
      return;
    }
    sessionStorage.setItem("selectedImages", JSON.stringify(finalImages));
    router.push("/previewFrameGallery");
  };

  const handleGoToHome = () => {
    router.push("/");
  };

  const isAllSlotsFilled = images.every((image) => image !== null);

  return (
    <main style={styles.container}>
      {/* 파일 입력을 위한 숨겨진 input 요소 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* --- 상단 콘텐츠 (디자인 UI) --- */}
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
            {/* 다른 페이지와 통일성을 위해 "사진 고르기" 이미지 재사용 */}
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
          {images.map((src, index) => (
            <div
              key={index}
              style={styles.slot}
              onClick={() => handleSlotClick(index)}
            >
              {src ? (
                <Image
                  src={src}
                  alt={`slot ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <Image
                  src="/image/selectFromGallery/button.png"
                  alt={`slot ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- 하단 버튼 (디자인 UI) --- */}
      <div style={styles.buttonContainer}>
        <button style={styles.secondaryButton} onClick={handleGoToHome}>
          처음으로
        </button>
        <button
          style={{
            ...styles.primaryButton,
            ...(!isAllSlotsFilled ? styles.disabledButton : {}),
          }}
          disabled={!isAllSlotsFilled}
          onClick={handleConfirm}
        >
          다음
        </button>
      </div>
    </main>
  );
}

// --- 이미지 리사이징 헬퍼 함수 - 변경 없음 ---
function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > MAX_WIDTH_OR_HEIGHT) {
            height *= MAX_WIDTH_OR_HEIGHT / width;
            width = MAX_WIDTH_OR_HEIGHT;
          }
        } else {
          if (height > MAX_WIDTH_OR_HEIGHT) {
            width *= MAX_WIDTH_OR_HEIGHT / height;
            height = MAX_WIDTH_OR_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("2D context를 생성할 수 없습니다."));
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
