import { schema, type Schema } from './schema';
import { type Row } from '@rocicorp/zero';

export type User = Row<typeof schema.tables.user>;
export type Thread = Row<typeof schema.tables.thread>;
export type Message = Row<typeof schema.tables.message>;
export type Session = Row<typeof schema.tables.session>;
export type Setting = Row<typeof schema.tables.setting>;
export type Model = Row<typeof schema.tables.model>;

export type TableName = keyof Schema['tables'];

export type AuthData = {
    sub: string;
};
