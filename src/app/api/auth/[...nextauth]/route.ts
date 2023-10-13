import prisma from "@/lib/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // If email or password does not exist
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid Credentials");
        }
        // find user from db (whose email is entered in the form)
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        // if couldn't find user or password not exists
        if (!user || !user?.hashedPassword) throw new Error("User Not Found");
        // compare entered password with hashed password stored in the db
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        // if not correct
        if (!isPasswordCorrect) throw new Error("Invalid Credentials");
        // if everything is fine return user
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 604800, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      return { ...user, ...token };
    },
    async session({ session, token }) {
      return { ...session, user: token };
    },
  },
  // debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
