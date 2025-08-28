"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// 스타일 객체
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  header: {
    position: "absolute",
    top: "20px",
    border: "2px solid black",
    padding: "10px 20px",
    backgroundColor: "white",
  },
  title: { margin: 0, fontSize: "24px" },
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
  subtitle: { margin: "20px 0", fontSize: "20px" },
  button: {
    marginTop: "20px",
    padding: "15px",
    fontSize: "18px",
    cursor: "pointer",
    border: "2px solid black",
    backgroundColor: "white",
    width: "80%",
  },
  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },
  slot: {
    width: "150px",
    height: "150px",
    border: "2px dashed #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  plusIcon: { fontSize: "50px", color: "#ccc" },
};

const TOTAL_SLOTS = 4;
const MAX_WIDTH_OR_HEIGHT = 800; // 리사이징 될 이미지의 최대 가로/세로 크기

export default function SelectFromGallery() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<(string | null)[]>(
    Array(TOTAL_SLOTS).fill(null)
  );
  const [currentSlot, setCurrentSlot] = useState<number | null>(null);

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

    // 같은 파일을 다시 선택할 수 있도록 입력 값을 비워줍니다.
    event.target.value = "";
  };

  const handleConfirm = () => {
    const finalImages = images.filter((img) => img !== null) as string[];
    sessionStorage.setItem("selectedImages", JSON.stringify(finalImages));
    router.push("/previewFrame");
  };

  const isAllSlotsFilled = images.every((image) => image !== null);

  return (
    <main style={styles.container}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      <div style={styles.header}>
        <h1 style={styles.title}>바다의 인생네컷</h1>
      </div>
      <div style={styles.contentContainer}>
        <h2 style={styles.subtitle}>사진 고르기</h2>
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
                <span style={styles.plusIcon}>+</span>
              )}
            </div>
          ))}
        </div>
        <button
          style={styles.button}
          disabled={!isAllSlotsFilled}
          onClick={handleConfirm}
        >
          선택 완료
        </button>
      </div>
    </main>
  );
}

// 이미지 리사이징을 처리하는 헬퍼 함수
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

        // 이미지의 가로 또는 세로가 최대 크기를 초과하면, 비율을 유지하며 크기 조정
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

        // 용량이 더 작은 JPEG 형식과 퀄리티(0.9)를 지정하여 base64 데이터로 변환
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
