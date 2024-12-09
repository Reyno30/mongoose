// app/api/auth/[...nextauth]/route.ts
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// Create a handler using NextAuth and the options from authOptions
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };
