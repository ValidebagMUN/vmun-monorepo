import { getServerSession } from "#auth";
import { eq } from "drizzle-orm";

import { db } from '~/server/db/service';
import { chairs } from '~/server/db/schema';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        if (isNaN(Number(id))) {
            throw createError({
                statusCode: 400
            })
        }
    
        const session: any = await getServerSession(event);
        if (!session) {
            throw createError({
                statusCode: 403
            })
        }

        if (session.user?.type === 'chair') {
            const chair = await db.query.chairs.findFirst({ where: (chairs, { eq }) => eq(chairs.userId, session.user?.id) })
            if (chair && chair.id === Number(id)) {
                return chair;
            }
            else throw createError({
                statusCode: 403
            })
        }
        else if (session.user?.type === 'admin' || session.user?.type === 'staff') {
            const chair = await db.query.chairs.findFirst({ where: (chairs, { eq }) => eq(chairs.id, Number(id)) })
            if(typeof chair == undefined) throw createError({
                statusCode: 404
            })
            return chair;
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