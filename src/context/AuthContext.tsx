import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  name: string;
  email: string;
  createdAt: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const USERS_KEY = "@auth_users";
const CURRENT_USER_KEY = "@auth_current_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (stored) setUser(JSON.parse(stored));
      setIsLoading(false);
    })();
  }, []);

  const getUsers = async (): Promise<StoredUser[]> => {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  const login = async (email: string, password: string) => {
    const users = await getUsers();
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!match) throw new Error("Invalid email or password.");
    const loggedIn: User = {
      name: match.name,
      email: match.email,
      createdAt: match.createdAt,
    };
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedIn));
    setUser(loggedIn);
  };

  const signup = async (name: string, email: string, password: string) => {
    const users = await getUsers();
    const exists = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (exists) throw new Error("An account with this email already exists.");
    const createdAt = new Date().toISOString();
    const newUser: StoredUser = { name, email, password, createdAt };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const loggedIn: User = { name, email, createdAt };
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedIn));
    setUser(loggedIn);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
