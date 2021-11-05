/* eslint-disable import/no-anonymous-default-export */
// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { 
  getUser, 
  userExist, 
  createUser, 
  createToken 
} from "../../../utils";

export default (req, res) =>
  NextAuth(req, res, {
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        scope: "user:email"
      }),
    ],
    debug: false,
    secret: process.env.AUTH_SECRET,
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    callbacks: {
      async redirect(url, baseUrl) {
        return "/";
      },
      async signIn({ user, account, profile, email, credentials }) {
        if (!(await userExist(email))) {
          console.log("creating user")
          await createUser({
            email,
            name: "xxx",
            // TODO: Make this truly random
            secret: "random"
          })
        }
        return true;
      },
      async session(session) {
        const user = await getUser(session.user.email);
        session.user.accessKeyId = user.accessKeyId;
        session.user.accessKeySecret = await createToken(user.accessKeyId);
        return session
      }
    },
  });
