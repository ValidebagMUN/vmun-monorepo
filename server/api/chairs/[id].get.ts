import { getServerSession } from "#auth";
import { eq } from "drizzle-orm";

import { db } from '~/server/db/service';
import { chairs } from '~/server/db/schema';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        if (isNaN(Number(id))) {
            throw createError({
                status: 400
            })
        }
    
        const session: any = await getServerSession(event);
        if (!session) {
            throw createError({
                status: 403
            })
        }

        if (session.user?.type === 'chair') {
            const chair = await db.query.chairs.findFirst({ where: (chairs, { eq }) => eq(chairs.userId, session.user?.id) })
            if (chair && chair.id === Number(id)) {
                return chair;
            }
            else throw createError({
                status: 403
            })
        }
        else if (session.user?.type === 'admin' || session.user?.type === 'staff') {
            const chair = await db.query.chairs.findFirst({ where: (chairs, { eq }) => eq(chairs.id, Number(id)) })
            if(typeof chair == undefined) throw createError({
                status: 404
            })
            return chair;
        }
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