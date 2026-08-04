import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { useReminderNotifications } from "./hooks/useReminderNotifications";
import { NewWordPage } from "./pages/NewWordPage";
import { RemindersPage } from "./pages/RemindersPage";
import { SignInPage } from "./pages/SignInPage";
import type { User } from "./types";

const STORAGE_KEY = "wordloom-user";

function readStoredUser(): User | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as User) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(readStoredUser);
  const notifications = useReminderNotifications(user);

  const signIn = (selected: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    setUser(selected);
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  if (!user) return <SignInPage onSignIn={signIn} />;

  return (
    <BrowserRouter>
      <Layout
        user={user}
        reminderCount={notifications.reminders.length}
        notificationSupported={notifications.supported}
        notificationPermission={notifications.permission}
        onEnableNotifications={() => void notifications.requestPermission()}
        onSignOut={signOut}
      >
        <Routes>
          <Route path="/words/new" element={<NewWordPage user={user} />} />
          <Route
            path="/reminders"
            element={
              <RemindersPage
                user={user}
                reminders={notifications.reminders}
                loading={notifications.loading}
                error={notifications.error}
                onRefresh={notifications.refresh}
              />
            }
          />
          <Route path="*" element={<Navigate replace to="/words/new" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
