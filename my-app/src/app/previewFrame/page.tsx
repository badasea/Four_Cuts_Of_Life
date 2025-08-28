"use client";

import React, { useState, useEffect, useRef } from "react"; // useRef import
import { useRouter } from "next/navigation";
import PreviewFrameForm from "./@components/PreviewFrame";
import html2canvas from "html2canvas"; // html2canvas import

const styles: { [key: string]: React.CSSProperties } = {
  /* 이전과 동일 */
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
  title: {
    margin: 0,
    fontSize: "24px",
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
  loadingText: {
    fontSize: "20px",
  },
};

export default function PreviewPage() {
  const router = useRouter();
  const [frame, setFrame] = useState<"1x4" | "2x2" | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✨ 다운로드할 DOM 요소를 참조하기 위한 ref 생성
  const frameRef = useRef<HTMLDivElement>(null);

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
    router.push("/selectImage");
  };

  // ✨ 수정된 '확정' 버튼 클릭 함수 (다운로드 로직)
  const handleConfirm = async () => {
    const frameElement = frameRef.current;
    if (!frameElement) return;

    try {
      // html2canvas를 사용해 선택된 div를 canvas로 변환
      const canvas = await html2canvas(frameElement);

      // canvas를 PNG 이미지 데이터 URL로 변환
      const image = canvas.toDataURL("image/png");

      // 다운로드를 위한 임시 링크 생성
      const link = document.createElement("a");
      link.href = image;
      link.download = "my-lifefourcut.png"; // 파일 이름 설정

      // 링크를 클릭하여 다운로드 트리거
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("이미지 생성 중 오류 발생:", error);
      alert("이미지 생성에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <main style={styles.container}>
        <div style={styles.contentContainer}>
          <p style={styles.loadingText}>결과를 불러오는 중입니다...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>바다의 인생네컷</h1>
      </div>
      <div style={styles.contentContainer}>
        {/* ✨ 자식 컴포넌트에 ref 전달 */}
        <PreviewFrameForm
          ref={frameRef}
          frame={frame!}
          selectedImages={selectedImages}
          onRetake={handleRetake}
          onConfirm={handleConfirm}
        />
      </div>
    </main>
  );
}
