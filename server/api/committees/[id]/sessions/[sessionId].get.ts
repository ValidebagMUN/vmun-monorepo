import { getServerSession } from '#auth';
import { and, eq } from 'drizzle-orm'

import { db } from '~/server/db/service';
import { sessions, chairs } from '~/server/db/schema';

export default defineEventHandler(async (event) => {
    try {
        const session: any = await getServerSession(event);
        if (!session) throw createError({
            statusCode: 403
        })
    
        const { id, sessionId } = getRouterParams(event);
        if (isNaN(Number(id)) || isNaN(Number(sessionId))) throw createError({
            statusCode: 400
        })

        const chair = await db.select().from(chairs).where(eq(chairs.userId, session.user?.id));
        if (chair[0] && session.user?.type == 'chair' && chair[0].committeeId == Number(id)) {
            const committeeSession = await db.select().from(sessions).where(and(eq(sessions.committeeId, chair[0].committeeId), eq(sessions.number, Number(sessionId))))
            if (!committeeSession[0]) throw createError({
                statusCode: 404
            })
            return committeeSession[0];
        }
        else if (session.user?.type == 'admin' || session.user?.type == 'staff') {
            const committeeSession = await db.select().from(sessions).where(eq(sessions.committeeId, Number(id))).where(eq(sessions.number, Number(sessionId)))
            if (!committeeSession[0]) throw createError({
                statusCode: 404
            })
            return committeeSession[0];
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