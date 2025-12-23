import heic2any from "heic2any";
import { toast } from "sonner";

/**
 * Image file handler with HEIC conversion
 */
export const handleImageUpload = async (
  file: File,
  onSuccess: (file: File, previewUrl: string) => void,
  onError?: (error: string) => void
): Promise<void> => {
  if (!file) return;

  const fileName = file.name.toLowerCase();

  // ✅ Valid image types that don't need conversion
  const validImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  // ✅ Check MIME type FIRST (more reliable than filename)
  if (validImageTypes.includes(file.type)) {
    // File is already in supported format, no conversion needed
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      const errorMsg = `Image size ${(file.size / 1024 / 1024).toFixed(
        2
      )}MB exceeds 10MB limit`;
      toast.error(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onSuccess(file, previewUrl);
    return;
  }

  // ✅ Check if HEIC/HEIF by MIME type (more reliable than extension)
  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif")
  ) {
    toast.info("Converting HEIC to JPG...");

    try {
      // Convert to JPEG
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      // Handle array of blobs (heic2any can return array)
      const blob = Array.isArray(convertedBlob)
        ? convertedBlob[0]
        : convertedBlob;

      // Create File from Blob with .jpg extension
      const convertedFile = new File(
        [blob],
        file.name.replace(/\.(heic|heif)$/i, ".jpg"),
        {
          type: "image/jpeg",
          lastModified: Date.now(),
        }
      );

      const previewUrl = URL.createObjectURL(convertedFile);
      toast.success("Image converted successfully!");
      onSuccess(convertedFile, previewUrl);
    } catch (error: any) {
      console.error("HEIC conversion failed:", error);

      // ✅ If conversion fails but file is browser-readable, use it anyway
      if (
        error.code === 1 &&
        error.message.includes("already browser readable")
      ) {
        toast.info("Using image as-is");
        const previewUrl = URL.createObjectURL(file);
        onSuccess(file, previewUrl);
        return;
      }

      const errorMsg = "Failed to convert image. Please use JPG/PNG instead.";
      toast.error(errorMsg);
      if (onError) onError(errorMsg);
    }
    return;
  }

  // ✅ Unsupported file type
  const errorMsg = "Please upload a valid image (JPG, PNG, WEBP, GIF, HEIC)";
  toast.error(errorMsg);
  if (onError) onError(errorMsg);
};

/**
 * Video file handler with validation
 */
export const handleVideoUpload = (
  file: File,
  onSuccess: (file: File, previewUrl: string) => void,
  onError?: (error: string) => void,
  maxSizeMB: number = 200
): void => {
  if (!file) return;

  // ✅ Validate video type
  const validVideoTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ];

  if (!validVideoTypes.includes(file.type)) {
    const errorMsg = "Please upload a valid video (MP4, WEBM, OGG, MOV)";
    toast.error(errorMsg);
    if (onError) onError(errorMsg);
    return;
  }

  // ✅ Check file size
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    const errorMsg = `Video size ${(file.size / 1024 / 1024).toFixed(
      2
    )}MB exceeds ${maxSizeMB}MB limit`;
    toast.error(errorMsg);
    if (onError) onError(errorMsg);
    return;
  }

  // ✅ Success - return file and preview
  const previewUrl = URL.createObjectURL(file);
  toast.success("Video selected");
  onSuccess(file, previewUrl);
};

/**
 * Generic file handler that detects type and routes to appropriate handler
 */
export const handleFileUpload = async (
  file: File,
  type: "image" | "video",
  onSuccess: (file: File, previewUrl: string) => void,
  onError?: (error: string) => void
): Promise<void> => {
  if (type === "image") {
    await handleImageUpload(file, onSuccess, onError);
  } else if (type === "video") {
    handleVideoUpload(file, onSuccess, onError);
  }
};

/**
 * Cleanup preview URLs to prevent memory leaks
 */
export const cleanupPreviewUrls = (urls: string[]): void => {
  urls.forEach((url) => {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  });
};

/**
 * Accepted file types for input accept attribute
 */
export const ACCEPTED_IMAGE_TYPES =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic,image/heif";
export const ACCEPTED_VIDEO_TYPES =
  "video/mp4,video/webm,video/ogg,video/quicktime";
