import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '../../db/service'
import { committees, chairs } from '../../db/schema'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    try {
        const numId = Number(id);
        if (isNaN(numId)) {
            throw createError({
                status: 400,
                statusMessage: "Bad Request"
            })
        }
    } catch (e: any) {
        throw createError({
            status: 400,
            statusMessage: e.message
        })
    }

    const session: any = await getServerSession(event);
    if (!session) {
        throw createError({
            status: 403,
            statusMessage: 'Unauthorized'
        })
    }
    
    try {
        const chair = await db.select().from(chairs).where(eq(chairs.userId, session.user?.id))
        if (chair[0] && session.user?.type === 'chair' && chair[0].committeeId?.toString() === id) {
            const committee = await db.select().from(committees).where(eq(committees.id, chair[0].committeeId!))
            if (committee[0]) {
                return committee[0];
            }
            else {
                throw createError({
                    status: 404,
                    statusMessage: 'Not Found'
                })
            }
        }
        else if (session.user?.type === 'admin' || session.user?.type === 'staff') {
            const committee = await db.select().from(committees).where(eq(committees.id, Number(id)))
            if (!committee[0]) {
                throw createError({
                    status: 404,
                    statusMessage: 'Not Found'
                })
            }
            return committee[0];
        }
    } catch (e: any) {
        throw createError({
            status: 500,
            statusMessage: e.message
        })
    }
})