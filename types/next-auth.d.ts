import { DefaultSession } from "next-auth";

type PapelUsuario = "cliente" | "corretor";

declare module "next-auth" {
  interface User {
    papel: PapelUsuario;
  }

  interface Session {
    user: {
      id: string;
      papel: PapelUsuario;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    papel: PapelUsuario;
  }
}
