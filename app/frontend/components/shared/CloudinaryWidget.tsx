import React, { useEffect, useState } from "react";

interface CloudinaryWidgetProps {
  onUploadSuccess: (imageUrls: string[]) => void;
}

const CloudinaryWidget: React.FC<CloudinaryWidgetProps> = ({
  onUploadSuccess,
}) => {
  const maxImages = 3;
  const [currentImageCount, setCurrentImageCount] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const cloudinaryWidget = (window as any).cloudinary.createUploadWidget(
      {
        cloud_name: "your-cloud-name",
        upload_preset: "pr_unsigned",
        multiple: true,
        sources: ["local", "url", "camera"],
        folder: "petregistry",
        clientAllowedFormats: ["png", "jpg", "jpeg"],
        maxFileSize: 5 * 1024 * 1024, // 5MB
      },
      (error: any, result: any) => {
        if (!error && result.event === "success") {
          if (currentImageCount >= maxImages) {
            alert(`You can only upload a maximum of ${maxImages} images.`);
            return;
          }

          const newImageUrl = result.info.secure_url;
          setImageUrls((prevUrls) => {
            const updatedUrls = [...prevUrls, newImageUrl];
            onUploadSuccess(updatedUrls);
            return updatedUrls;
          });
          setCurrentImageCount((count) => count + 1);
        }

        if (error) {
          console.error("Error during upload:", error);
        }
      }
    );

    document
      .getElementById("cloudinary-widget")
      ?.addEventListener("click", () => {
        if (currentImageCount < maxImages) {
          cloudinaryWidget.open();
        } else {
          alert(`You can only upload a maximum of ${maxImages} images.`);
        }
      });

    return () => {
      document
        .getElementById("cloudinary-widget")
        ?.removeEventListener("click", cloudinaryWidget.open);
    };
  }, [currentImageCount]);

  return (
    <div>
      <button
        id="cloudinary-widget"
        type="button"
        className="cloudinary-upload btn"
      >
        Upload Images
      </button>
      <div className="uploaded-images">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              display: "inline-block",
              marginTop: "10px",
              marginRight: "10px",
            }}
          >
            <img src={url} alt="Uploaded" style={{ maxWidth: "200px" }} />
            <button
              onClick={() => {
                setImageUrls(imageUrls.filter((_, i) => i !== index));
                setCurrentImageCount(currentImageCount - 1);
              }}
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
                padding: "0 4px",
                fontSize: "12px",
                borderRadius: "4px",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudinaryWidget;
