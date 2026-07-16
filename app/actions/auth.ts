"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function cadastrarUsuario(formData: FormData) {
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const senha = formData.get("senha") as string;

  if (!nome || !email || !senha) {
    return { erro: "Preencha todos os campos." };
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    return { erro: "Já existe uma conta com esse email." };
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaHash,
    },
  });

  return { sucesso: true };
}
export async function entrarUsuario(formData: FormData) {
  const email = formData.get("email") as string;
  const senha = formData.get("senha") as string;

  if (!email || !senha) {
    return { erro: "Preencha todos os campos." };
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    return { erro: "Email ou senha incorretos." };
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    return { erro: "Email ou senha incorretos." };
  }

  return { sucesso: true };
}