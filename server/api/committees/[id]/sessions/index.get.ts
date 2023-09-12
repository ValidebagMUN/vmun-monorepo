import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '../../../../db/service'
import { committees, sessions, chairs } from '../../../../db/schema'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        if (isNaN(Number(id))) {
            throw createError({
                status: 400
            })
        }

        const session: any = await getServerSession(event);
        if (!session) throw createError({
            status: 403
        })

        const chair = await db.select().from(chairs).where(eq(chairs.userId, session.user?.id));
        let committeeSessions;
        if (chair[0] && session.user?.type == 'chair' && chair[0].committeeId == Number(id)) {
            committeeSessions = await db.select().from(sessions).where(eq(sessions.committeeId, chair[0].committeeId))
            
        }
        else if (session.user?.type == 'admin' || session.user?.type == 'staff') {
            committeeSessions = await db.select().from(sessions).where(eq(sessions.committeeId, Number(id)))
        }
        else throw createError({
            status: 403
        })
        return committeeSessions;
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