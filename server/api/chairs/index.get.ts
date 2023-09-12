import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '~/server/db/service'
import { chairs } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
    try {
        const session: any = await getServerSession(event);
        if(!session) throw createError({
            status: 403,
        })

        if (session.user.type == 'admin' || session.user.type == 'staff') {
            const chairList = await db.select().from(chairs);
            return chairList;
        }
        else {
            const chair = await db.select().from(chairs).where(eq(chairs.userId, session.user.id));
            return chair;
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