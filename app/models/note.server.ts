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

  return prisma.post.findFirst({
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

export function createNote({
  title,
  preface,
  body,
  slug,
  isPublish = false,
  userId,
}: Pick<Post, "body" | "title" | "preface" | "isPublish" | "slug"> & {
  userId: User["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      preface,
      body,
      isPublish,
      slug,
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
