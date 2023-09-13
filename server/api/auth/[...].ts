import { NuxtAuthHandler } from '#auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'

import { db } from '~/server/db/service'
import { users } from '~/server/db/schema'


export default NuxtAuthHandler({
    secret: process.env.AUTH_SECRET,
    callbacks: {
        jwt: async ({ token, user}) => {
            const isSignIn = user ? true : false;
            if (isSignIn) {
                token.id = user ? user.id || '' : '';
                token.type = user ? (user as any).type || '' : '';
            }
            return Promise.resolve(token);
        },
        session: async ({ session, token }) => {
            (session as any).user.id = token.id;
            (session as any).user.type = token.type;
            return Promise.resolve(session);
        }
    },
    providers: [
        //@ts-expect-error
        CredentialsProvider.default({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials: { email: string, password: string }) => {
                try {
                    // const user = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, credentials.email) })
                    const user = (await db.selectDistinct().from(users).where(eq(users.email, credentials.email)))[0];
                    if (user) {
                        const match = await bcrypt.compare(credentials.password, user.password);
                        if (match) {
                            const { password, ...sanitizedUser } = user;
                            await db.update(users).set({ last_login: new Date() }).where(eq(users.id, user.id));
                            return sanitizedUser;
                        } else return null;
                    }
                    else return null;
                } catch (e:any) {
                    throw createError({
                        status: 400,
                        statusMessage: e.message
                    })
                }
            }
        })
    ]
});