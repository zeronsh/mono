/* eslint-disable */
/* tslint:disable */
// noinspection JSUnusedGlobalSymbols
// biome-ignore-all
/*
 * ------------------------------------------------------------
 * ## This file was automatically generated by drizzle-zero. ##
 * ## Any changes you make to this file will be overwritten. ##
 * ##                                                        ##
 * ## Additionally, you should also exclude this file from   ##
 * ## your linter and/or formatter to prevent it from being  ##
 * ## checked or modified.                                   ##
 * ##                                                        ##
 * ## SOURCE: https://github.com/0xcadams/drizzle-zero        ##
 * ------------------------------------------------------------
 */

import type { ZeroCustomType } from 'drizzle-zero';
import type { default as zeroSchema } from '../drizzle-zero.config';

type Test = (typeof zeroSchema)['tables'];

/**
 * The Zero schema object.
 * This type is auto-generated from your Drizzle schema definition.
 */
export const schema = {
    tables: {
        message: {
            name: 'message',
            columns: {
                id: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'message',
                        'id'
                    >,
                },
                message: {
                    type: 'json',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'message',
                        'message'
                    >,
                },
                createdAt: {
                    type: 'number',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'message',
                        'createdAt'
                    >,
                    serverName: 'created_at',
                },
                updatedAt: {
                    type: 'number',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'message',
                        'updatedAt'
                    >,
                    serverName: 'updated_at',
                },
                threadId: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'message',
                        'threadId'
                    >,
                    serverName: 'thread_id',
                },
                userId: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'message',
                        'userId'
                    >,
                    serverName: 'user_id',
                },
            },
            primaryKey: ['id'],
        },
        model: {
            name: 'model',
            columns: {
                id: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<typeof zeroSchema, 'model', 'id'>,
                },
                name: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'model',
                        'name'
                    >,
                },
                model: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'model',
                        'model'
                    >,
                },
                description: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'model',
                        'description'
                    >,
                },
                capabilities: {
                    type: 'json',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'model',
                        'capabilities'
                    >,
                },
                icon: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'model',
                        'icon'
                    >,
                },
                access: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'model',
                        'access'
                    >,
                },
                createdAt: {
                    type: 'number',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'model',
                        'createdAt'
                    >,
                    serverName: 'created_at',
                },
                updatedAt: {
                    type: 'number',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'model',
                        'updatedAt'
                    >,
                    serverName: 'updated_at',
                },
            },
            primaryKey: ['id'],
        },
        session: {
            name: 'session',
            columns: {
                id: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'session',
                        'id'
                    >,
                },
                expiresAt: {
                    type: 'number',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'session',
                        'expiresAt'
                    >,
                    serverName: 'expires_at',
                },
                token: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'session',
                        'token'
                    >,
                },
                createdAt: {
                    type: 'number',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'session',
                        'createdAt'
                    >,
                    serverName: 'created_at',
                },
                updatedAt: {
                    type: 'number',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'session',
                        'updatedAt'
                    >,
                    serverName: 'updated_at',
                },
                ipAddress: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'session',
                        'ipAddress'
                    >,
                    serverName: 'ip_address',
                },
                userAgent: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'session',
                        'userAgent'
                    >,
                    serverName: 'user_agent',
                },
                userId: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'session',
                        'userId'
                    >,
                    serverName: 'user_id',
                },
            },
            primaryKey: ['id'],
        },
        setting: {
            name: 'setting',
            columns: {
                id: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'setting',
                        'id'
                    >,
                },
                mode: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'setting',
                        'mode'
                    >,
                },
                theme: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'setting',
                        'theme'
                    >,
                },
                userId: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'setting',
                        'userId'
                    >,
                    serverName: 'user_id',
                },
                nickname: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'setting',
                        'nickname'
                    >,
                },
                biography: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'setting',
                        'biography'
                    >,
                },
                instructions: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'setting',
                        'instructions'
                    >,
                },
                modelId: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'setting',
                        'modelId'
                    >,
                    serverName: 'model_id',
                },
            },
            primaryKey: ['id'],
        },
        thread: {
            name: 'thread',
            columns: {
                id: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'thread',
                        'id'
                    >,
                },
                title: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'thread',
                        'title'
                    >,
                },
                status: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'thread',
                        'status'
                    >,
                },
                streamId: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'thread',
                        'streamId'
                    >,
                    serverName: 'stream_id',
                },
                createdAt: {
                    type: 'number',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'thread',
                        'createdAt'
                    >,
                    serverName: 'created_at',
                },
                updatedAt: {
                    type: 'number',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'thread',
                        'updatedAt'
                    >,
                    serverName: 'updated_at',
                },
                userId: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'thread',
                        'userId'
                    >,
                    serverName: 'user_id',
                },
            },
            primaryKey: ['id'],
        },
        user: {
            name: 'user',
            columns: {
                id: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<typeof zeroSchema, 'user', 'id'>,
                },
                name: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'user',
                        'name'
                    >,
                },
                email: {
                    type: 'string',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'user',
                        'email'
                    >,
                },
                emailVerified: {
                    type: 'boolean',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'user',
                        'emailVerified'
                    >,
                    serverName: 'email_verified',
                },
                image: {
                    type: 'string',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'user',
                        'image'
                    >,
                },
                createdAt: {
                    type: 'number',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'user',
                        'createdAt'
                    >,
                    serverName: 'created_at',
                },
                updatedAt: {
                    type: 'number',
                    optional: false,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'user',
                        'updatedAt'
                    >,
                    serverName: 'updated_at',
                },
                isAnonymous: {
                    type: 'boolean',
                    optional: true,
                    customType: null as unknown as ZeroCustomType<
                        typeof zeroSchema,
                        'user',
                        'isAnonymous'
                    >,
                    serverName: 'is_anonymous',
                },
            },
            primaryKey: ['id'],
        },
    },
    relationships: {
        message: {
            thread: [
                {
                    sourceField: ['threadId'],
                    destField: ['id'],
                    destSchema: 'thread',
                    cardinality: 'one',
                },
            ],
            user: [
                {
                    sourceField: ['userId'],
                    destField: ['id'],
                    destSchema: 'user',
                    cardinality: 'one',
                },
            ],
        },
        setting: {
            user: [
                {
                    sourceField: ['userId'],
                    destField: ['id'],
                    destSchema: 'user',
                    cardinality: 'one',
                },
            ],
            model: [
                {
                    sourceField: ['modelId'],
                    destField: ['id'],
                    destSchema: 'model',
                    cardinality: 'one',
                },
            ],
        },
        thread: {
            user: [
                {
                    sourceField: ['userId'],
                    destField: ['id'],
                    destSchema: 'user',
                    cardinality: 'one',
                },
            ],
            messages: [
                {
                    sourceField: ['id'],
                    destField: ['threadId'],
                    destSchema: 'message',
                    cardinality: 'many',
                },
            ],
        },
        user: {
            threads: [
                {
                    sourceField: ['id'],
                    destField: ['userId'],
                    destSchema: 'thread',
                    cardinality: 'many',
                },
            ],
            messages: [
                {
                    sourceField: ['id'],
                    destField: ['userId'],
                    destSchema: 'message',
                    cardinality: 'many',
                },
            ],
            settings: [
                {
                    sourceField: ['id'],
                    destField: ['userId'],
                    destSchema: 'setting',
                    cardinality: 'one',
                },
            ],
        },
    },
} as const;

/**
 * Represents the Zero schema type.
 * This type is auto-generated from your Drizzle schema definition.
 */
export type Schema = typeof schema;
