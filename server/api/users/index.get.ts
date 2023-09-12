import { getServerSession } from '#auth';
import { eq } from 'drizzle-orm';

import { db } from '../../db/service'
import { users } from '../../db/schema'

export default defineEventHandler(async (event) => {
    try {
        const session: any = await getServerSession(event);
        if (!session) throw createError({
            status: 403
        })
        
        if(session.user.type == 'admin' || session.user.type == 'staff') {
            const userList = await db.select({
                id: users.id,
                email: users.email,
                createdAt: users.created_at,
                lastLogin: users.last_login,
                type: users.type
            }).from(users);
            return userList;
        }
        else {
            const user = await db.select({
                id: users.id,
                email: users.email,
                createdAt: users.created_at,
                lastLogin: users.last_login,
                type: users.type
            }).from(users).where(eq(users.id, session.user.id));
            return user;
        }
    } catch (e: any) {
        switch (e.statusCode) {
            case 404: {
                throw createError({
                    status: 404,
                    statusMessage: 'Not Found',
                    statusText: e.statusText
                })
            }
            case 403: {
                throw createError({
                    status: 403,
                    statusMessage: 'Forbidden',
                    statusText: e.statusText
                })
            }
            case 400: {
                throw createError({
                    status: 400,
                    statusMessage: 'Bad Request',
                    statusText: e.statusText
                })
            }
            default: {
                throw createError({
                    status: 500,
                    statusMessage: 'Internal Server Error',
                    statusText: e.statusText
                })
            }
        }
    }
})