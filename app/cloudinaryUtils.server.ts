import type { UploadHandler } from "@remix-run/server-runtime";
import {
  writeAsyncIterableToWritable,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
} from "@remix-run/node";
import { v2 as cloudinary } from "cloudinary";
import { getPathImgCloudinary } from "./utils";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function cloudinaryUploadImage(
  data: AsyncIterable<Uint8Array>
): Promise<unknown> {
  const uploadPromise = new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "remix",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
    await writeAsyncIterableToWritable(data, uploadStream);
  });

  return uploadPromise;
}

export const uploadImageHandler: (fileInputName: string) => UploadHandler = (
  fileInputName
) =>
  composeUploadHandlers(
    async ({ name, data }) => {
      try {
        if (name !== fileInputName) {
          return;
        }
        const uploadedImage = await cloudinaryUploadImage(data);

        //@ts-ignore
        return getPathImgCloudinary(uploadedImage);
      } catch (e) {
        return "";
      }
    },

    createMemoryUploadHandler()
  );
