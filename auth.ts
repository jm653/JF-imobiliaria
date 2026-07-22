import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        senha: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const senha = credentials?.senha as string | undefined;

        if (!email || !senha) return null;

        const usuario = await prisma.usuario.findUnique({
          where: { email },
          include: {
            perfilCliente: true,
            perfilCorretor: true,
          },
        });
        if (!usuario) return null;

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) return null;

        const papel = usuario.perfilCorretor ? "corretor" : "cliente";

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          papel,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
  if (user) {
    token.id = user.id;
    token.papel = user.papel;
  }
  if (trigger === "signIn") {
    await prisma.usuario.update({
      where: { id: token.id as string },
      data: { contadorAcessos: { increment: 1 } },
    });
  }
  return token;
},
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.papel = user.papel;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.papel = token.papel as "cliente" | "corretor";
      }
      return session;
    },
  },
});
