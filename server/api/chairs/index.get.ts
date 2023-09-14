import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '~/server/db/service'
import { chairs } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
    try {
        const session: any = await getServerSession(event);
        if(!session) throw createError({
            statusCode: 403,
        })

        if (session.user.type == 'admin' || session.user.type == 'staff') {
            const chairList = await db.select().from(chairs);
            return chairList;
        }
        else {
            const chair = await db.select().from(chairs).where(eq(chairs.userId, session.user.id));
            return structuredClone(chair);
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
                    statusMessage: e.message,
                    
                })
            }
        }
    }
})