// GoTo NextAuth.js to understand  how this thing is working

import NextAuth from "next-auth/next";
import GoggleProvider from "next-auth/providers/google";

// connect to mongo DB
import { connectToDB } from "@utils/database";

// import User Model
import User from "@models/user";

/*
For getting client id and client secret kay:
1. Go To: console.cloud.google
2. Create new project
3. Go To : API & Services>Credentials>Create Credentials>OAuth Client ID. click on Create button.
4. Copy clientId and clientSecrent and paste it in .env file and access it here

*/

const handler = NextAuth({
  providers: [
    GoggleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // Always check which user currently online

      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        // check user already exist
        const userExists = await User.findOne({
          email: profile.email,
        });

        // if not, create new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
