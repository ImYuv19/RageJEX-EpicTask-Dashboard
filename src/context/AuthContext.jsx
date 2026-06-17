import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import {
  createId,
  initializeStorage,
  STORAGE_KEYS,
} from "../services/storageService.js";
import { validateLogin, validateSignup } from "../utils/validators.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  useState(() => {
    initializeStorage();
    return true;
  });

  const [users, setUsers] = useLocalStorage(STORAGE_KEYS.users, []);
  const [currentUser, setCurrentUser] = useLocalStorage(
    STORAGE_KEYS.currentUser,
    null
  );

  const signup = useCallback(
    (values) => {
      const errors = validateSignup(values);

      if (Object.keys(errors).length) {
        return { ok: false, errors };
      }

      const normalizedEmail = values.email.trim().toLowerCase();
      const emailTaken = users.some(
        (user) => user.email.toLowerCase() === normalizedEmail
      );

      if (emailTaken) {
        return {
          ok: false,
          errors: { email: "An account already exists for this email." },
        };
      }

      const user = {
        id: createId("user"),
        fullName: values.fullName.trim(),
        email: normalizedEmail,
        password: values.password,
      };

      setUsers((previousUsers) => [...previousUsers, user]);
      setCurrentUser(user);
      return { ok: true, user };
    },
    [setCurrentUser, setUsers, users]
  );

  const login = useCallback(
    (values) => {
      const errors = validateLogin(values);

      if (Object.keys(errors).length) {
        return { ok: false, errors };
      }

      const user = users.find(
        (item) =>
          item.email.toLowerCase() === values.email.trim().toLowerCase() &&
          item.password === values.password
      );

      if (!user) {
        return {
          ok: false,
          errors: { password: "Email or password is incorrect." },
        };
      }

      setCurrentUser(user);
      return { ok: true, user };
    },
    [setCurrentUser, users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const updateProfile = useCallback(
    (updates) => {
      if (!currentUser) return;

      const updatedUser = {
        ...currentUser,
        fullName: updates.fullName?.trim() || currentUser.fullName,
        email: updates.email?.trim().toLowerCase() || currentUser.email,
      };

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === currentUser.id ? updatedUser : user
        )
      );
      setCurrentUser(updatedUser);
    },
    [currentUser, setCurrentUser, setUsers]
  );

  const value = useMemo(
    () => ({
      users,
      currentUser,
      isAuthenticated: Boolean(currentUser),
      signup,
      login,
      logout,
      updateProfile,
    }),
    [currentUser, login, logout, signup, updateProfile, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
