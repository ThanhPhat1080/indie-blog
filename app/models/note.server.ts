import {v2 as cloudinary} from "cloudinary";
import { writeAsyncIterableToWritable } from "@remix-run/node";

import type { User, Post } from "@prisma/client";

import { prisma } from "~/db.server";
import { isEmptyOrNotExist } from "~/utils";

export type { Post } from "@prisma/client";

export function getNote({
  id,
  userId,
}: Pick<Post, "id"> & {
  userId: User["id"];
}) {
  return prisma.post.findFirst({
    select: { id: true, body: true, title: true },
    where: { id, userId },
  });
}

export function getPostBySlug(slug: string, userId?: string) {
  const query = isEmptyOrNotExist(userId) ? { slug } : { slug, userId };

  return prisma.post.findFirstOrThrow({
    where: query,
  });
}

export function getPostListItems({ userId }: { userId: User["id"] }) {
  return prisma.post.findMany({
    where: { userId },
    select: { id: true, title: true, slug: true, preface: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createPost({
  title,
  preface,
  body,
  slug,
  isPublish = false,
  userId,
  coverImage
}: Pick<Post, "body" | "title" | "preface" | "isPublish" | "slug" | "coverImage"> & {
  userId: User["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      preface,
      body,
      isPublish,
      slug,
      coverImage,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteNote({
  id,
  userId,
}: Pick<Post, "id"> & { userId: User["id"] }) {
  return prisma.post.deleteMany({
    where: { id, userId },
  });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function cloudinaryUploadImage(data: AsyncIterable<Uint8Array>) {
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