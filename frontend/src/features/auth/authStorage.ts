import type { User, UserRole } from "../../types/auth";

const USERS_STORAGE_KEY = "users";

interface StoredUser extends User {
  password: string;
}

function getStoredUsers(): StoredUser[] {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    return [];
  }

  try {
    return JSON.parse(storedUsers) as StoredUser[];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function registerUser(
  name: string,
  email: string,
  password: string,
  role: UserRole,
): User | null {
  const users = getStoredUsers();

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    return null;
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    role,
  };

  saveStoredUsers([...users, user]);

  const { password: _password, ...publicUser } = user;

  return publicUser;
}

export function authenticateUser(email: string, password: string): User | null {
  const users = getStoredUsers();

  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (currentUser) =>
      currentUser.email === normalizedEmail &&
      currentUser.password === password,
  );

  if (!user) {
    return null;
  }

  const { password: _password, ...publicUser } = user;

  return publicUser;
}
