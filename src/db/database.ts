import sqlite3 from "sqlite3";

export interface User {
  id: number;
  name: string;
  email: string;
}

const db = new sqlite3.Database("database.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `);
});

export function addUser(name: string, email: string, callback: (error: Error | null) => void): void {
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function (err) {
    callback(err);
  });
}

export function getUserById(id: number, callback: (error: Error | null, user?: User) => void): void {
  db.get<User>("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    callback(err, row ?? undefined);
  });
}

export function getUsers(callback: (error: Error | null, users?: User[]) => void): void {
    db.all<User>("SELECT * FROM users", (err, rows) => {
      callback(err, rows ?? []);
    });
}

export function getUserCount(callback: (error: Error | null, count?: number) => void): void {
  db.get<{ count: number }>("SELECT COUNT(*) AS count FROM users", (err, row) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, row?.count ?? 0);
  });
}

export function deleteUser(id: number, callback: (error: Error | null, changes?: number) => void): void {
  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    callback(err, this.changes ?? 0);
  });
}

process.on("exit", () => db.close());
