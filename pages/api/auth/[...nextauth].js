/* eslint-disable import/no-anonymous-default-export */
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { 
  getUser, 
  userExist, 
  createUser, 
  createToken 
} from "../../../utils";
import fetch from 'node-fetch'
import logger from '@fonoster/logger'

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
        logger.verbose(`webui signIn [profile -> ${JSON.stringify(profile)}]`)
        logger.verbose(`webui signIn [account -> ${JSON.stringify(account)}]`)
        const _email = await getEmail(account);
        if (!await userExist(_email)) {
          await createUser({
            email: _email,
            name: profile.name,
            // Setting this to a secured value but we won't
            // support username/password for now
            secret: account.accessToken
          })
        }
        return true;
      },
      async session(session, token) {
        logger.verbose(`webui session [session -> ${JSON.stringify(session)}]`)
        logger.verbose(`webui session [token -> ${JSON.stringify(token)}]`)
        const _email = await getEmail(token.account);
        const user = await getUser(_email);
        session.user.accessKeyId = user.accessKeyId;
        session.user.accessKeySecret = await createToken(user.accessKeyId);
        return session
      },
      async jwt(token, user, account) {
        logger.verbose(`webui jwt [session -> ${JSON.stringify(token)}]`)
        logger.verbose(`webui jwt [token -> ${JSON.stringify(user)}]`)
        logger.verbose(`webui jwt [account -> ${JSON.stringify(account)}]`)
        user && (token.user = user);
        account && (token.account = account);
        return token
      },
    },
  });
