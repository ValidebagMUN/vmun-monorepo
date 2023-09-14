import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '~/server/db/service'
import { chairs } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
    try {
        /* const session: any = await getServerSession(event);
        if(!session) throw createError({
            statusCode: 403,
        }) */
        const session = {
            user: {
              email: "example@vmun.app",
              id: 3,
              type: "chair"
            },
            expires: "2023-10-14T12:55:10.003Z"
          }
        
        //const chair = await db.select().from(chairs).where(eq(3, chairs.userId))
        const chair = await db.select().from(chairs).where(eq(chairs.userId, session.user.id))
        if (!chair[0]) throw createError({
            statusCode: 404
        })
        return chair[0];
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
