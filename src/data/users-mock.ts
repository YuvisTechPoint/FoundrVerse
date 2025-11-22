export type MockUser = {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  lastLoginAt: number;
  provider?: string;
};

const users = new Map<string, MockUser>();

export function upsertMockUser(user: MockUser) {
  users.set(user.uid, {
    ...users.get(user.uid),
    ...user,
    lastLoginAt: Date.now(),
  });
  return users.get(user.uid)!;
}

export function getMockUser(uid: string) {
  return users.get(uid) ?? null;
}

export function getMockUsers() {
  return Array.from(users.values());
}

