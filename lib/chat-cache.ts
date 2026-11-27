import type { DtoPrivateMessageDto } from "@/api/generated";
import {
  deleteDatabaseAsync,
  openDatabaseSync,
  type SQLiteDatabase,
} from "expo-sqlite";

export type CachedChatMessage = DtoPrivateMessageDto;

const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS messages (
  viewer_id TEXT NOT NULL,
  counterpart_id TEXT NOT NULL,
  id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  content TEXT,
  message_kind TEXT,
  payload TEXT,
  created_at TEXT NOT NULL,
  is_read INTEGER,
  is_recalled INTEGER,
  recalled_at TEXT,
  recall_reason TEXT,
  sender_json TEXT,
  receiver_json TEXT,
  PRIMARY KEY (viewer_id, counterpart_id, id)
);
CREATE INDEX IF NOT EXISTS idx_messages_conv_created
  ON messages (viewer_id, counterpart_id, created_at DESC, id DESC);
`;

const DEFAULT_PAGE_SIZE = 50;

type DBHandle = { viewerId: string; db: SQLiteDatabase };

let current: DBHandle | null = null;

function dbNameFor(viewerId: string): string {
  return `chat-cache-${viewerId.replace(/[^A-Za-z0-9_-]/g, "_")}.db`;
}

function ensureDB(viewerId: string): SQLiteDatabase | null {
  if (!viewerId) return null;
  if (current && current.viewerId === viewerId) return current.db;

  // Viewer changed (login switch). Close previous handle.
  if (current) {
    try {
      current.db.closeSync();
    } catch {}
    current = null;
  }

  try {
    const db = openDatabaseSync(dbNameFor(viewerId));
    db.execSync(SCHEMA_SQL);
    current = { viewerId, db };
    return db;
  } catch (e) {
    console.warn("chat-cache: open failed", e);
    return null;
  }
}

type Row = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string | null;
  message_kind: string | null;
  payload: string | null;
  created_at: string;
  is_read: number | null;
  is_recalled: number | null;
  recalled_at: string | null;
  recall_reason: string | null;
  sender_json: string | null;
  receiver_json: string | null;
};

function rowToMessage(row: Row): CachedChatMessage {
  const payload = row.payload ? safeJSONParse(row.payload) : undefined;
  const sender = row.sender_json ? safeJSONParse(row.sender_json) : undefined;
  const receiver = row.receiver_json
    ? safeJSONParse(row.receiver_json)
    : undefined;
  return {
    id: row.id,
    sender_id: row.sender_id,
    receiver_id: row.receiver_id,
    content: row.content ?? undefined,
    message_kind: (row.message_kind ??
      undefined) as CachedChatMessage["message_kind"],
    payload: (payload ?? undefined) as Record<string, unknown> | undefined,
    created_at: row.created_at,
    is_read: row.is_read == null ? undefined : Boolean(row.is_read),
    is_recalled: row.is_recalled == null ? undefined : Boolean(row.is_recalled),
    recalled_at: row.recalled_at ?? undefined,
    recall_reason: row.recall_reason ?? undefined,
    sender: sender as CachedChatMessage["sender"],
    receiver: receiver as CachedChatMessage["receiver"],
  };
}

function safeJSONParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function safeJSONStringify(value: unknown): string | null {
  if (value == null) return null;
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

// 同步取最近 N 条缓存消息（新的在前），没有就返回空数组
export function loadCachedMessagesSync(
  viewerId: string,
  counterpartId: string,
  limit: number = DEFAULT_PAGE_SIZE,
): CachedChatMessage[] {
  const db = ensureDB(viewerId);
  if (!db || !counterpartId) return [];
  try {
    const rows = db.getAllSync<Row>(
      `SELECT id, sender_id, receiver_id, content, message_kind, payload,
              created_at, is_read, is_recalled, recalled_at, recall_reason,
              sender_json, receiver_json
       FROM messages
       WHERE viewer_id = ? AND counterpart_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT ?`,
      [viewerId, counterpartId, limit],
    );
    return rows.map(rowToMessage);
  } catch (e) {
    console.warn("chat-cache: read failed", e);
    return [];
  }
}

// Upsert a batch of messages into the cache.
export async function upsertCachedMessages(
  viewerId: string,
  counterpartId: string,
  messages: readonly CachedChatMessage[],
): Promise<void> {
  const db = ensureDB(viewerId);
  if (!db || !counterpartId || messages.length === 0) return;

  const rows = messages.filter((m) => !!m.id && !!m.created_at);
  if (rows.length === 0) return;

  try {
    await db.withExclusiveTransactionAsync(async (txn) => {
      const stmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO messages (
          viewer_id, counterpart_id, id, sender_id, receiver_id,
          content, message_kind, payload, created_at, is_read,
          is_recalled, recalled_at, recall_reason, sender_json, receiver_json
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      );
      try {
        for (const m of rows) {
          await stmt.executeAsync([
            viewerId,
            counterpartId,
            m.id!,
            String(m.sender_id ?? ""),
            String(m.receiver_id ?? ""),
            m.content ?? null,
            m.message_kind ?? null,
            safeJSONStringify(m.payload),
            m.created_at!,
            m.is_read == null ? null : m.is_read ? 1 : 0,
            m.is_recalled == null ? null : m.is_recalled ? 1 : 0,
            m.recalled_at ?? null,
            m.recall_reason ?? null,
            safeJSONStringify(m.sender),
            safeJSONStringify(m.receiver),
          ]);
        }
      } finally {
        await stmt.finalizeAsync();
      }
    });
  } catch (e) {
    console.warn("chat-cache: upsert failed", e);
  }
}

export async function markCachedMessageRecalled(
  viewerId: string,
  messageId: string,
  recalledAt?: string,
  recallReason?: string,
): Promise<void> {
  const db = ensureDB(viewerId);
  if (!db || !messageId) return;
  try {
    await db.runAsync(
      `UPDATE messages
       SET is_recalled = 1,
           recalled_at = COALESCE(?, recalled_at),
           recall_reason = COALESCE(?, recall_reason)
       WHERE viewer_id = ? AND id = ?`,
      [recalledAt ?? null, recallReason ?? null, viewerId, messageId],
    );
  } catch (e) {
    console.warn("chat-cache: mark recalled failed", e);
  }
}

// Wipe the current user's cache.
export async function clearChatCache(): Promise<void> {
  const handle = current;
  current = null;
  if (!handle) return;
  try {
    handle.db.closeSync();
  } catch {}
  try {
    await deleteDatabaseAsync(dbNameFor(handle.viewerId));
  } catch (e) {
    console.warn("chat-cache: delete failed", e);
  }
}
