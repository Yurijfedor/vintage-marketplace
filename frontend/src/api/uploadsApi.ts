import API_BASE_URL from "./apiConfig";
import { getAuthToken } from "../features/auth/authTokenStorage";

interface UploadSignature {
  timestamp: number;
  folder: string;
  signature: string;
  apiKey: string;
  cloudName: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: {
    message?: string;
  };
}

export async function uploadProductImage(file: File): Promise<string> {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Оберіть зображення у форматі JPG, PNG або WebP.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Розмір фотографії не повинен перевищувати 10 МБ.");
  }

  const token = getAuthToken();

  if (!token) {
    throw new Error("Для завантаження фотографій потрібно увійти в акаунт.");
  }

  const signatureResponse = await fetch(`${API_BASE_URL}/uploads/signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!signatureResponse.ok) {
    throw new Error("Не вдалося отримати дозвіл на завантаження фото.");
  }

  const signatureData = (await signatureResponse.json()) as UploadSignature;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", String(signatureData.timestamp));
  formData.append("folder", signatureData.folder);
  formData.append("signature", signatureData.signature);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const uploadResult =
    (await uploadResponse.json()) as CloudinaryUploadResponse;

  if (!uploadResponse.ok) {
    console.error("Cloudinary upload failed:", uploadResult.error);
    throw new Error(
      uploadResult.error?.message ??
        "Не вдалося завантажити фотографію в Cloudinary.",
    );
  }

  if (!uploadResult.secure_url) {
    throw new Error("Cloudinary не повернув адресу фотографії.");
  }

  return uploadResult.secure_url;
}
