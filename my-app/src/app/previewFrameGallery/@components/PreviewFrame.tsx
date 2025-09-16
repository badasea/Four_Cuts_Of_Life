import Image from "next/image";
import React, { forwardRef } from "react";

interface PreviewFrameProps {
  frame: "1x4" | "2x2";
  selectedImages: string[];
}

const styles: { [key: string]: React.CSSProperties } = {
  frameContainer: {
    backgroundColor: "white",
    padding: "12px",
    display: "inline-block",
  },
  frame1x4: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "180px",
  },
  frame2x2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    width: "320px",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
  },
  logoInFrame: {
    position: "relative",
    width: "40px",
    margin: "0 auto 10px",
  },
};

const PreviewFrameForm = forwardRef<HTMLDivElement, PreviewFrameProps>(
  ({ frame, selectedImages }, ref) => {
    // 프레임 종류에 따라 컨테이너 스타일을 동적으로 결정
    const containerStyle =
      frame === "1x4"
        ? { ...styles.frameContainer, ...styles.frame1x4 }
        : { ...styles.frameContainer, ...styles.frame2x2 };

    return (
      <div ref={ref} style={containerStyle}>
        {/* 로고를 항상 렌더링 */}
        <div
          style={{
            ...styles.logoInFrame,
            // 2x2 프레임일 경우, 로고가 그리드의 모든 열을 차지하도록 설정
            ...(frame === "2x2" ? { gridColumn: "1 / -1" } : {}),
          }}
        >
          <Image
            src="/image/title.png"
            alt="iYS Logo"
            width={40}
            height={20}
            layout="responsive"
          />
        </div>

        {selectedImages.map((src, index) => (
          <div key={index} style={styles.imageWrapper}>
            <Image
              src={src}
              alt={`selected photo ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    );
  }
);

PreviewFrameForm.displayName = "PreviewFrameForm";
export default PreviewFrameForm;
