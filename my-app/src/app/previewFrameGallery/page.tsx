"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Image 컴포넌트 import
import PreviewFrameForm from "./@components/PreviewFrame";
import html2canvas from "html2canvas";

// --- 새로운 디자인에 맞춘 스타일 ---
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
    gap: "30px", // 헤더와 프레임 사이 간격
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
  loadingText: {
    fontSize: "20px",
    color: "#555",
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
};

export default function PreviewPage() {
  const router = useRouter();
  const [frame, setFrame] = useState<"1x4" | "2x2" | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);

  // --- 기존 비즈니스 로직 (변경 없음) ---
  useEffect(() => {
    const storedFrame = sessionStorage.getItem("selectedFrame") as
      | "1x4"
      | "2x2"
      | null;
    const storedImagesJSON = sessionStorage.getItem("selectedImages");

    if (!storedFrame || !storedImagesJSON) {
      alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
      router.push("/");
      return;
    }

    const storedImages = JSON.parse(storedImagesJSON);
    setFrame(storedFrame);
    setSelectedImages(storedImages);
    setIsLoading(false);
  }, [router]);

  const handleRetake = () => {
    router.push("/selectFromGallery");
  };

  const handleConfirm = async () => {
    const frameElement = frameRef.current;
    if (!frameElement) return;
    try {
      const canvas = await html2canvas(frameElement, {
        backgroundColor: null, // 투명 배경으로 캡처
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "my-photobooth.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("이미지 생성 중 오류 발생:", error);
      alert("이미지 생성에 실패했습니다.");
    }
  };

  // 로딩 중 UI
  if (isLoading) {
    return (
      <main style={styles.container}>
        <p style={styles.loadingText}>결과를 불러오는 중입니다...</p>
      </main>
    );
  }

  // --- JSX 구조를 새 디자인에 맞게 변경 ---
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
              src="/image/previewFrame/previewFrame.png"
              alt="사진 미리보기"
              width={150}
              height={40}
              layout="responsive"
            />
          </div>
        </div>

        {/* 자식 컴포넌트는 이제 프레임만 렌더링 */}
        <PreviewFrameForm
          ref={frameRef}
          frame={frame!}
          selectedImages={selectedImages}
        />
      </div>

      {/* 버튼들을 부모 컴포넌트에서 직접 렌더링 */}
      <div style={styles.buttonContainer}>
        <button style={styles.secondaryButton} onClick={handleRetake}>
          다시 고르기
        </button>
        <button style={styles.primaryButton} onClick={handleConfirm}>
          다운로드
        </button>
      </div>
    </main>
  );
}
