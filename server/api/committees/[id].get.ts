import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '~/server/db/service'
import { committees, chairs } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        if (isNaN(Number(id))) throw createError({
            statusCode: 400
        })
    
        const session: any = await getServerSession(event);
        if (!session) throw createError({
            statusCode: 403
        })
        
        const chair = await db.select().from(chairs).where(eq(chairs.userId, session.user?.id))
        if (chair[0] && session.user?.type === 'chair' && chair[0].committeeId == Number(id)) {
            const committee = await db.select().from(committees).where(eq(committees.id, chair[0].committeeId!))
            if (!committee[0]) throw createError({
                statusCode: 404
            })
            return committee[0];
        }
        else if (session.user?.type === 'admin' || session.user?.type === 'staff') {
            const committee = await db.select().from(committees).where(eq(committees.id, Number(id)))
            if (!committee[0]) throw createError({
                statusCode: 404
            })
            return committee[0];
        }
        else throw createError({
            statusCode: 403
        })
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