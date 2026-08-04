import type { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

import type { User } from "../types";

interface LayoutProps extends PropsWithChildren {
  user: User;
  reminderCount: number;
  notificationSupported: boolean;
  notificationPermission: NotificationPermission;
  onEnableNotifications: () => void;
  onSignOut: () => void;
}

export function Layout({
  children,
  user,
  reminderCount,
  notificationSupported,
  notificationPermission,
  onEnableNotifications,
  onSignOut,
}: LayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <NavLink className="brand" to="/words/new" aria-label="Wordloom home">
            <span className="brand-mark" aria-hidden="true">W</span>
            <span>
              <strong>Wordloom</strong>
              <small>Words, woven into memory</small>
            </span>
          </NavLink>

          <nav className="primary-nav" aria-label="Main navigation">
            <NavLink to="/words/new">
              <span aria-hidden="true">＋</span>
              Add a word
            </NavLink>
            <NavLink to="/words">
              <span aria-hidden="true">☷</span>
              Added words
            </NavLink>
            <NavLink to="/reminders">
              <span aria-hidden="true">◷</span>
              Reviews
              {reminderCount > 0 && <b className="nav-count">{reminderCount}</b>}
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-footer">
          {notificationSupported && notificationPermission === "default" && (
            <button className="notification-prompt" type="button" onClick={onEnableNotifications}>
              <span aria-hidden="true">♢</span>
              Enable browser reminders
            </button>
          )}
          <div className="user-row">
            <span className="avatar">{user.username.slice(0, 1).toUpperCase()}</span>
            <span>
              <strong>{user.username}</strong>
              <button type="button" onClick={onSignOut}>Switch learner</button>
            </span>
          </div>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
