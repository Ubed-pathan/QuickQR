// Simple in-memory ephemeral store for demo purposes.
// For production, back with Redis or a database and object storage.

export type StoredFile = {
  name: string;
  type: string;
  size: number;
  buffer: Buffer;
};

export type Session = {
  code: string;
  files: StoredFile[];
  createdAt: number;
  expiresAt: number;
};

const TTL_MS = 15 * 60 * 1000; // 15 minutes

class EphemeralStore {
  private map = new Map<string, Session>();
  private cleaner?: NodeJS.Timeout;

  constructor() {
    if (!this.cleaner) {
      this.cleaner = setInterval(() => this.purgeExpired(), 60 * 1000);
    }
  }

  create(code: string) {
    const now = Date.now();
    const sess: Session = {
      code,
      files: [],
      createdAt: now,
      expiresAt: now + TTL_MS,
    };
    this.map.set(code, sess);
    return sess;
  }

  has(code: string) {
    const s = this.map.get(code);
    return !!s && s.expiresAt > Date.now();
  }

  putFiles(code: string, files: StoredFile[]) {
    const s = this.map.get(code) ?? this.create(code);
    s.files.push(...files);
    s.expiresAt = Date.now() + TTL_MS; // bump ttl
    this.map.set(code, s);
  }

  get(code: string) {
    const s = this.map.get(code);
    if (!s) return undefined;
    if (s.expiresAt <= Date.now()) {
      this.map.delete(code);
      return undefined;
    }
    return s;
  }

  consume(code: string) {
    const s = this.get(code);
    if (!s) return undefined;
    this.map.delete(code);
    return s;
  }

  purgeExpired() {
    const now = Date.now();
    for (const [k, s] of this.map) {
      if (s.expiresAt <= now) this.map.delete(k);
    }
  }
}

// Ensure a singleton per process
// eslint-disable-next-line import/no-mutable-exports
export let store = globalThis.__sharex_store as EphemeralStore | undefined;
if (!store) {
  store = new EphemeralStore();
  (globalThis as any).__sharex_store = store;
}

export default store;
