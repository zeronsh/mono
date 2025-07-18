import { type db, schema } from '.';
import { and, eq, gt, not } from 'drizzle-orm';
import { type ThreadMessage } from '@zeron/ai/types';
import { nanoid } from '@zeron/ai/utils';

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Database = typeof db | Transaction;

export async function getThreadById(db: Database, threadId: string) {
    return db.query.thread.findFirst({
        where: (thread, { eq }) => eq(thread.id, threadId),
    });
}

export async function getMessageById(db: Database, messageId: string) {
    return db.query.message.findFirst({
        where: (message, { eq }) => eq(message.id, messageId),
    });
}

export async function getModelById(db: Database, modelId: string) {
    return db.query.model.findFirst({
        where: (model, { eq }) => eq(model.id, modelId),
    });
}

export async function createThread(db: Database, args: { userId: string; threadId: string }) {
    return db
        .insert(schema.thread)
        .values({
            id: args.threadId,
            userId: args.userId,
            status: 'submitted',
        })
        .returning();
}

export async function createMessage(
    db: Database,
    args: {
        threadId: string;
        userId: string;
        message: ThreadMessage;
    }
) {
    return db
        .insert(schema.message)
        .values({
            id: args.message.id,
            threadId: args.threadId,
            userId: args.userId,
            message: args.message,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning();
}

export async function updateMessage(
    db: Database,
    args: {
        messageId: string;
        message: ThreadMessage;
        updatedAt?: Date;
    }
) {
    return db
        .update(schema.message)
        .set({
            message: args.message,
            updatedAt: args.updatedAt,
        })
        .where(eq(schema.message.id, args.messageId))
        .returning();
}

export async function deleteTrailingMessages(
    db: Database,
    args: {
        threadId: string;
        messageId: string;
        messageCreatedAt: Date;
    }
) {
    return await db
        .delete(schema.message)
        .where(
            and(
                eq(schema.message.threadId, args.threadId),
                gt(schema.message.createdAt, args.messageCreatedAt),
                not(eq(schema.message.id, args.messageId))
            )
        )
        .returning();
}

export async function getThreadMessageHistory(db: Database, threadId: string) {
    const messages = await db.query.message.findMany({
        where: (message, { eq }) => eq(message.threadId, threadId),
        orderBy: (message, { asc }) => asc(message.createdAt),
    });

    return messages.map(message => message.message);
}

export async function updateThread(
    db: Database,
    args: {
        threadId: string;
        status: 'ready' | 'streaming' | 'submitted';
        streamId?: string | null;
        updatedAt?: Date;
    }
) {
    return await db
        .update(schema.thread)
        .set({
            status: args.status,
            streamId: args.streamId,
            updatedAt: args.updatedAt,
        })
        .where(eq(schema.thread.id, args.threadId))
        .returning();
}

export async function updateThreadTitle(db: Database, args: { threadId: string; title: string }) {
    return await db
        .update(schema.thread)
        .set({ title: args.title, updatedAt: new Date() })
        .where(eq(schema.thread.id, args.threadId))
        .returning();
}

export async function getThreadByStreamId(db: Database, streamId: string) {
    const thread = await db.query.thread.findFirst({
        where: (thread, { eq }) => eq(thread.streamId, streamId),
    });

    return thread;
}

export async function createSettings(db: Database, args: { userId: string }) {
    return await db
        .insert(schema.setting)
        .values({
            id: nanoid(),
            userId: args.userId,
            mode: 'dark',
            theme: 'default',
            modelId: 'gpt-4o-mini',
        })
        .returning();
}

export async function getSettingsByUserId(db: Database, userId: string) {
    return await db.query.setting.findFirst({
        where: (setting, { eq }) => eq(setting.userId, userId),
    });
}

export async function updateSettings(
    db: Database,
    args: { userId: string; settings: Partial<typeof schema.setting.$inferSelect> }
) {
    return await db
        .update(schema.setting)
        .set(args.settings)
        .where(eq(schema.setting.userId, args.userId))
        .returning();
}

export async function transferChatsFromAnonymousToUser(
    db: Database,
    args: { anonymousUserId: string; userId: string }
) {
    return await db
        .update(schema.thread)
        .set({ userId: args.userId })
        .where(eq(schema.thread.userId, args.anonymousUserId))
        .returning();
}

export async function transferMessagesFromAnonymousToUser(
    db: Database,
    args: { anonymousUserId: string; userId: string }
) {
    return await db
        .update(schema.message)
        .set({ userId: args.userId })
        .where(eq(schema.message.userId, args.anonymousUserId))
        .returning();
}
