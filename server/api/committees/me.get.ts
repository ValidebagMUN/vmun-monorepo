import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '../../db/service'
import { chairs, committees } from '../../db/schema'

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