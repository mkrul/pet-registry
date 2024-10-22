import React, { useEffect, useState, useCallback } from "react";
import { IImage } from "../../types/shared/Image";

interface CloudinaryWidgetProps {
  imageUrls: IImage[];
  onUploadSuccess: (images: IImage[]) => void; // Accept IImage[]
}

const CloudinaryWidget: React.FC<CloudinaryWidgetProps> = ({ imageUrls, onUploadSuccess }) => {
  const maxImages = 3;
  const [imagePaths, setImagePaths] = useState<IImage[]>(imageUrls);
  const [cloudinaryConfig, setCloudinaryConfig] = useState({
    cloud_name: "",
    api_key: "",
    api_secret: ""
  });
  const [error, setError] = useState<string | null>(null);

  // Update imagePaths when imageUrls prop changes
  useEffect(() => {
    setImagePaths(imageUrls);
  }, [imageUrls]);

  const currentImageCount = imagePaths.length;

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

  const handleUploadSuccess = useCallback(
    (resultInfo: any) => {
      const newImage: IImage = {
        id: undefined, // Assign an ID if available
        url: resultInfo.secure_url,
        thumbnailUrl: resultInfo.thumbnail_url || resultInfo.secure_url,
        publicId: resultInfo.public_id || ""
      };

      setImagePaths(prevImages => {
        const updatedImages = [...prevImages, newImage];

        // Inform parent component of the updated images
        onUploadSuccess(updatedImages);

        return updatedImages;
      });
    },
    [onUploadSuccess]
  );

  const handleRemoveImage = (index: number) => {
    setImagePaths(prevImages => {
      const updatedImages = prevImages.filter((_, i) => i !== index);

      // Inform parent component of the updated images
      onUploadSuccess(updatedImages);

      return updatedImages;
    });
  };

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
          handleUploadSuccess(result.info);
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
      <div className="uploaded-imageUrls mt-2">
        {imagePaths.map((img, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              display: "inline-block",
              marginTop: "10px",
              marginRight: "10px"
            }}
          >
            <img
              src={img.thumbnailUrl}
              alt="Uploaded"
              style={{ maxWidth: "150px", maxHeight: "150px" }}
            />
            <button
              onClick={event => {
                event.preventDefault();
                handleRemoveImage(index);
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
