import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";


import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import sendVerificationRequest from './sendVerificationRequest'
import {addSubscriber, sendTransactionEmail} from "@/lib/listmonk";
import {allowedEmails} from "@/lib/allow-emails";


const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET)
  throw new Error("Failed to initialize Github authentication");

export const authOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      },
      from: process.env.DEFAULT_FROM_EMAIL,
      sendVerificationRequest,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          gh_username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_ID,
      profile(profile) {
        console.log(profile)
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          gh_username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  adapter: PrismaAdapter(prisma),
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT ? ".linkb.org" : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        username: user.username,
        bio: user.bio,
        newsletter: user.newsletter,
        newsletter_id: user.newsletter_id,
        theme: user.theme,
      },
    }),
  },
  events: {
    createUser: async ({ user }) => {
      try {
        const email = user.email;
        let name = user.name;
        const welcome_mail = user.welcome_mail;

        if (!name){
          name = email.split("@")[0]
        }

        const data = {
          email,
          name,
          status: "enabled",
          lists: [4],
          preconfirm_subscriptions: true
        }

        try {
          const response = await addSubscriber(data);

          if (response.status !== 409 && !welcome_mail){
            await prisma.user.update({
              where: {
                email: email,
              },
              data: {
                newsletter_id: String(response.data.id),
                welcome_mail: true
              },
            });

            await sendTransactionEmail("welcome", email, {})
          }
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error('Failed to add subscriber:', error);
      }
      return user;
    },
    updateUser: async ({ user }) => {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email
        }
      });

      if (!existingUser.welcome_mail){
        await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            welcome_mail: true,
          },
        });

        await sendTransactionEmail("welcome", user.email, {})
      }
      return user;
    },
  }
};

export default async function auth(req, res) {

  // if(req.method === "POST") {
  //   const {email} = req.body;
  //   const emailDomain = email.split('@')[1];
  //
  //   const existingUser = await prisma.user.findUnique({
  //     where: {
  //       email: email
  //     }
  //   })
  //
  //   // if (!(allowedEmails.includes(email) || allowedDomains.includes(emailDomain) || existingUser)) {
  //   if (!(allowedEmails.includes(email) || existingUser)) {
  //     return res.json({
  //       error: "Something wong",
  //       status: 200,
  //       ok: true,
  //       url: "http://app.localhost:3000/login"
  //     })
  //   }
  // }

  return await NextAuth(req, res, authOptions);
}