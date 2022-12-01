import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { removeEmptyObjectProperties } from "~/utils";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser({
  name,
  bio = '',
  twitter = '',
  email,
  password,
}: Pick<User, "name" | "email" | "twitter" | "bio"> & { password: string }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      name,
      bio,
      twitter,
      avatar:
        "v1669912525/d6405738890860b9844024299ee0c7a6--flat-icons-free-icon_scra31.jpg",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function updateUserProfile({
  name,
  bio = "",
  twitter = "",
  avatar = "",
  id,
}: Pick<User, "id" | "name" | "twitter" | "bio" | "avatar">) {
  return prisma.user.update({
    where: { id },
    data: removeEmptyObjectProperties({
      name,
      bio,
      twitter,
      avatar,
    }),
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
