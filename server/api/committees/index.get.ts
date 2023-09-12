import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '../../db/service'
import { committees, chairs } from '../../db/schema'

export default defineEventHandler(async (event) => {
    try {
        const session: any = await getServerSession(event);
        if (!session) throw createError({
            status: 403
        })

        const chair = await db.select().from(chairs).where(eq(chairs.userId, session.user?.id))
        if (chair[0] && session.user?.type === 'chair') {
            const committee = await db.select().from(committees).where(eq(committees.id, chair[0].committeeId!))
            return committee;
        }
        else if (session.user?.type === 'admin' || session.user?.type === 'staff') {
            const committee = await db.select().from(committees)
            return committee;
        }
        else throw createError({
            status: 403
        })
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