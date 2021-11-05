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
import fetch from 'node-fetch'

async function getEmail(account) {
  // https://developer.github.com/v3/users/emails/#list-email-addresses-for-the-authenticated-user
  const res = await fetch('https://api.github.com/user/emails', {
    headers: {
      'Authorization': `token ${account.accessToken}`
    }
  })
  const emails = await res.json()
  if (!emails || emails.length === 0) {
    return
  }
  // Sort by primary email - the user may have several emails, but only one of them will be primary
  const sortedEmails = emails.sort((a, b) => b.primary - a.primary)
  return sortedEmails[0].email
}

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
      async signIn(profile, account) {
        const _email = await getEmail(account);
        if (!await userExist(_email)) {
          await createUser({
            email: _email,
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
