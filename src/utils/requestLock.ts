export interface RequestLock {
  acquire: () => boolean;
  release: () => void;
  isLocked: () => boolean;
}

export function createRequestLock(): RequestLock {
  let locked = false;

  return {
    acquire() {
      if (locked) return false;
      locked = true;
      return true;
    },
    release() {
      locked = false;
    },
    isLocked() {
      return locked;
    },
  };
}
