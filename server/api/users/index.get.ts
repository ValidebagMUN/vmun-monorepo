import { getServerSession } from '#auth';
import { eq } from 'drizzle-orm';

import { db } from '~/server/db/service'
import { users } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
    try {
        const session: any = await getServerSession(event);
        if (!session) throw createError({
            statusCode: 403
        })
        
        if(session.user.type == 'admin' || session.user.type == 'staff') {
            const userList = await db.select({
                id: users.id,
                email: users.email,
                createdAt: users.created_at,
                lastLogin: users.last_login,
                type: users.type
            }).from(users);
            return 0
            // return userList;
        }
        else {
            const user = await db.select().from(users).where(eq(users.id, session.user.id));
            console.log(typeof user)
            return 0
            // return structuredClone(user);
        }
    } catch (e: any) {
        switch (e.statusCode) {
            case 404: {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Not Found',
                    
                })
            }
            case 403: {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'Forbidden',
                    
                })
            }
            case 400: {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Bad Request',
                    
                })
            }
            default: {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Internal Server Error',
                    
                })
            }
        }
    }
})