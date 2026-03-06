import axios from 'axios';

/**
 * Uploads a file to Cloudinary using an unsigned upload preset and returns
 * the secure URL of the uploaded image.
 */
export const generateSecureUrl = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error("An error occured while uploading the file:", err);
    return { success: false, error: err };
  }
};
