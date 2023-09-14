import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '~/server/db/service'
import { users } from '~/server/db/schema'

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
        
        if(session.user.type == 'admin' || session.user.type == 'staff' || session.user.id == Number(id)) {
            const user = await db.select({
                id: users.id,
                email: users.email,
                createdAt: users.created_at,
                lastLogin: users.last_login,
                type: users.type
            }).from(users).where(eq(users.id, Number(id)));
            if (!user[0]) throw createError({
                statusCode: 404
            })
            return user[0];
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