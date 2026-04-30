import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "./db";
import { User } from "@/models/User";
import { Otp } from "@/models/Banner";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      id: "email-password",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        await dbConnect();
        const user = await User.findOne({ email: creds.email.toLowerCase() });
        if (!user || !user.passwordHash) return null;
        const ok = await bcrypt.compare(creds.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        } as any;
      },
    }),
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(creds) {
        if (!creds?.phone || !creds?.otp) return null;
        await dbConnect();
        const record = await Otp.findOne({
          phone: creds.phone,
          code: creds.otp,
          consumed: false,
          expiresAt: { $gt: new Date() },
        });
        if (!record) return null;
        record.consumed = true;
        await record.save();

        let user = await User.findOne({ phone: creds.phone });
        if (!user) {
          user = await User.create({
            name: `User ${creds.phone.slice(-4)}`,
            phone: creds.phone,
            role: "user",
          });
        }
        return {
          id: String(user._id),
          name: user.name,
          phone: user.phone,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).phone = token.phone;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
