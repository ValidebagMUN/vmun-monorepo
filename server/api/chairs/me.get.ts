import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '../../db/service'
import { chairs } from '../../db/schema'

export default defineEventHandler(async (event) => {
    const session: any = await getServerSession(event);
    if(!session) {
        throw createError({
            status: 403,
            statusMessage: 'Unauthorized'
        })
    }
    try {
        const chair = await db.select().from(chairs).where(eq(session.user?.id, chairs.userId))
        if (chair[0]) {
            return chair[0];
        }
        else {
            throw createError({
                status: 404,
                statusMessage: 'Not Found'
            })
        }
    } catch (e: any) {
        throw createError({
            status: 400,
            statusMessage: e.message
        })
    }
})
