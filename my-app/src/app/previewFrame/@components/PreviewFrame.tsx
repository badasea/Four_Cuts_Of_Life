import Image from "next/image";
import React, { forwardRef } from "react";

interface PreviewFrameProps {
  frame: "1x4" | "2x2";
  selectedImages: string[];
  onRetake: () => void;
  onConfirm: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  frameWrapper: {
    padding: "10px",
    backgroundColor: "#333",
    border: "1px solid #444",
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
  },
  frame1x4: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "150px",
  },
  frame2x2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    width: "310px",
  },
  imageContainer: {
    position: "relative",
    width: "130px",
    height: "130px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "2px solid black",
    backgroundColor: "white",
  },
};

const PreviewFrameForm = forwardRef<HTMLDivElement, PreviewFrameProps>(
  ({ frame, selectedImages, onRetake, onConfirm }, ref) => {
    const frameStyle = frame === "1x4" ? styles.frame1x4 : styles.frame2x2;

    return (
      <div style={styles.container}>
        <h2>최종 미리보기</h2>
        {/* ✨ ref를 이 div로 옮겨서 사진 프레임만 캡처하도록 수정 */}
        <div ref={ref} style={{ ...styles.frameWrapper, ...frameStyle }}>
          {selectedImages.map((src, index) => (
            <div key={index} style={styles.imageContainer}>
              <Image
                src={src}
                alt={`selected photo ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={onRetake}>
            다시 고르기
          </button>
          <button style={styles.button} onClick={onConfirm}>
            확정
          </button>
        </div>
      </div>
    );
  }
);

PreviewFrameForm.displayName = "PreviewFrameForm";
export default PreviewFrameForm;
