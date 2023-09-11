import { getServerSession } from "#auth";
import { eq } from "drizzle-orm";

import { db } from '../../db/service';
import { chairs } from '../../db/schema';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    try {
        if (isNaN(Number(id))) {
            throw createError({
                status: 400,
                statusMessage: "Bad Request"
            })
        }
    } catch (e: any) {
        throw createError({
            status: 400,
            statusMessage: e.message
        })
    }

    const session: any = await getServerSession(event);
    if (!session) {
        throw createError({
            status: 401,
            statusMessage: 'Unauthorized'
        })
    }

    try {
        if (session.user?.type === 'chair') {
            const chair = await db.select().from(chairs).where(eq(chairs.userId, session.user?.id));
            if (chair[0] && chair[0].id?.toString() === id) {
                console.log(typeof chair)
                return chair;
            }
            else throw createError({
                status: 403,
                statusMessage: 'Forbidden'
            })
        }
        else if (session.user?.type === 'admin' || session.user?.type === 'staff') {
            const chair = await db.select().from(chairs).where(eq(chairs.id, Number(id)));
            return chair;
        }
    } catch (e: any) {
        if (e.message == "Not Found") {
            throw createError({
                status: 404,
                statusMessage: e.message
            })
        }
        else throw createError({
            status: 400,
            statusMessage: e.message
        })
    }
})