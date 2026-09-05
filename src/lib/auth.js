import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Admin hardcoded access
        if (
          credentials.email === process.env.ADMIN_EMAIL && 
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: 1, name: "Admin", email: "admin@dhun.com", role: "admin" };
        }
        
        // Normal user access via DB
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) {
          return null; // No user found or user registered via Google only
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (isPasswordMatch) {
          return { id: user._id.toString(), name: user.name, email: user.email, role: "user" };
        }

        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          await User.findOneAndUpdate(
            { email: user.email },
            { name: user.name, image: user.image, lastLogin: new Date() },
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error("Error saving user on sign in:", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.email = token.email || session.user.email;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "dhun_super_secret_key"
};
