import React, { useEffect, useState, useCallback } from "react";

interface CloudinaryWidgetProps {
  onUploadSuccess: (images: string[]) => void;
}

const CloudinaryWidget: React.FC<CloudinaryWidgetProps> = ({ onUploadSuccess }) => {
  const maxImages = 3;
  const [currentImageCount, setCurrentImageCount] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [cloudinaryConfig, setCloudinaryConfig] = useState({
    cloud_name: "",
    api_key: "",
    api_secret: ""
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCloudinaryConfig = async () => {
      try {
        const response = await fetch("/api/cloudinary/credentials");
        const data = await response.json();
        setCloudinaryConfig({
          cloud_name: data.cloud_name,
          api_key: data.api_key,
          api_secret: data.api_secret
        });
      } catch (error) {
        setError("Failed to load Cloudinary credentials");
        console.error("Failed to load Cloudinary credentials:", error);
      }
    };

    fetchCloudinaryConfig();
  }, []);

  const handleUploadSuccess = useCallback((newImage: string) => {
    setImages(prevImages => {
      const updatedImages = [...prevImages, newImage];
      return updatedImages;
    });
  }, []);

  // Handle image count and pass URLs to parent component in an effect
  useEffect(() => {
    if (images.length > 0) {
      onUploadSuccess(images); // Only call this when images are updated
    }
    setCurrentImageCount(images.length);
  }, [images]); // Only run when the images array changes

  useEffect(() => {
    if (!cloudinaryConfig.cloud_name) return;

    const cloudinaryWidget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: cloudinaryConfig.cloud_name,
        upload_preset: "pr_unsigned",
        multiple: true,
        sources: ["local", "url", "camera"],
        folder: "petregistry",
        clientAllowedFormats: ["png", "jpg", "jpeg"],
        maxFileSize: 5 * 1024 * 1024 // 5MB
      },
      (error: any, result: any) => {
        if (!error && result.event === "success") {
          if (currentImageCount >= maxImages) {
            alert(`You can only upload a maximum of ${maxImages} images.`);
          } else {
            handleUploadSuccess(result.info.secure_url);
          }
        }

        if (error) {
          setError("Error during upload");
          console.error("Error during upload:", error);
        }
      }
    );

    const widgetButton = document.getElementById("cloudinary-widget");

    const handleClick = () => {
      if (currentImageCount < maxImages) {
        cloudinaryWidget.open();
      } else {
        alert(`You can only upload a maximum of ${maxImages} images.`);
      }
    };

    if (widgetButton) {
      widgetButton.addEventListener("click", handleClick);
    }

    return () => {
      if (widgetButton) {
        widgetButton.removeEventListener("click", handleClick);
      }
    };
  }, [currentImageCount, cloudinaryConfig.cloud_name, handleUploadSuccess]);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        id="cloudinary-widget"
        type="button"
        className="cloudinary-upload btn upload-btn"
        disabled={currentImageCount >= maxImages}
      >
        Upload Images
      </button>
      <div className="uploaded-images mt-2">
        {images.map((url, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              display: "inline-block",
              marginTop: "10px",
              marginRight: "10px"
            }}
          >
            <img src={url} alt="Uploaded" style={{ maxWidth: "150px" }} />
            <button
              onClick={event => {
                event.preventDefault();
                setImages(prevImages => prevImages.filter((_, i) => i !== index));
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
                borderRadius: "4px"
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
