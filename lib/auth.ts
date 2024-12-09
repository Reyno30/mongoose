// lib/auth.ts
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Ensure the database connection is established
        await connectDB();

        // Find the user by email in the database and include password field
        const user = await User.findOne({
          email: credentials?.email,
        }).select("+password");

        // If no user is found, throw an error
        if (!user) {
          throw new Error("Wrong Email");
        }

        // Compare provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        // If the password does not match, throw an error
        if (!passwordMatch) {
          throw new Error("Wrong Password");
        }

        // Remove password field for security before returning the user object
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};
