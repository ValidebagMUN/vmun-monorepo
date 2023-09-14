import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '~/server/db/service'
import { chairs, committees } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
    try {
        const session: any = await getServerSession(event);
        if(!session) throw createError({
            statusCode: 403
        })

        const chair = await db.select().from(chairs).where(eq(session.user?.id, chairs.userId))
        if (chair[0]) {
            const committee = await db.select().from(committees).where(eq(committees.id, chair[0].committeeId!))
            if (!committee[0]) throw createError({
                statusCode: 404
            })
            return committee[0];
        }
        else throw createError({
            statusCode: 404
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