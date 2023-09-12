import { pgEnum, pgTable, integer, serial, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


export const userEnum = pgEnum('user_type', ['chair', 'staff', 'admin']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email').unique(),
    password: varchar('password').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    last_login: timestamp('last_login'),
    type: userEnum('user_type')
});

export type InsertUser = typeof users.$inferInsert;

export const userRelations = relations(users, ({ one }) => ({
    chairs: one(chairs, {
        fields: [users.id],
        references: [chairs.userId]
    })
}));

enum RepresentativeEnum {
    Standard = 'standard',
    Veto = 'veto',
    NGO = 'ngo',
    Observer = 'observer'
};
type RepresentativeTypeEnum = keyof typeof RepresentativeEnum;

export type RepresentativeType = {
    id: Number,
    name: String,
    type: RepresentativeTypeEnum
}

export const committees = pgTable('committees', {
    id: serial('id').primaryKey(),
    name: varchar('name'),
    slug: varchar('slug', { length: 10}).unique(),
    agenda: varchar('agenda').array(),
    representatives: jsonb('representatives').$type<RepresentativeType[]>()
});

export const committeeRelations = relations(committees, ({ one, many }) => ({
    chairs: one(chairs, {
        fields: [committees.id],
        references: [chairs.committeeId]
    }),
    sessions: many(sessions),
    documents: many(documents)
}));

export const chairs = pgTable('chairs', {
    id: serial('id').primaryKey(),
    name: varchar('name'),
    created_at: timestamp('created_at').defaultNow(),
    userId: integer('user_id').references(() => users.id),
    committeeId: integer('committee_id').references(() => committees.id)
});

export const sessionEnum = pgEnum('session_type', ["regular", "special", "emergency"]);

export const sessions = pgTable('sessions', {
    id: serial('id').primaryKey(),
    number: integer('number'),
    type: sessionEnum('session_type'),
    started_at: timestamp('started_at'),
    committeeId: integer('committee_id').references(() => committees.id)
})

export const sessionRelations = relations(sessions, ({ one }) => ({
    committee: one(committees, {
        fields: [sessions.committeeId],
        references: [committees.id]
    })
}));

export const documentEnum = pgEnum('document_type', ["text", "link"]);

export const documents = pgTable('documents', {
    id: serial('id').primaryKey(),
    proposer: integer('proposer'),
    type: documentEnum('document_type'),
    content: text('content'),
    created_at: timestamp('created_at').defaultNow(),
    committeeId: integer('committee_id').references(() => committees.id)
});

export const documentRelations = relations(documents, ({ one }) => ({
    committee: one(committees, {
        fields: [documents.committeeId],
        references: [committees.id]
    })
}));
