"""Script to add banned words and test the feature"""
import sqlite3
import os

DB_NAME = 'events.db'

def setup_banned_words():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Create table if it doesn't exist
    c.execute('''CREATE TABLE IF NOT EXISTS banned_words
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  word TEXT UNIQUE NOT NULL,
                  added_by INTEGER,
                  reason TEXT,
                  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (added_by) REFERENCES users(id))''')
    
    # Add spam to banned words
    c.execute('INSERT OR IGNORE INTO banned_words (word, reason) VALUES (?, ?)', 
              ('spam', 'Prevent spam events'))
    
    # Delete existing spam events
    spam_events = c.execute('SELECT id, title FROM events WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ?', 
                           ('%spam%', '%spam%')).fetchall()
    
    for event in spam_events:
        event_id = event[0]
        print(f"Deleting spam event: {event[1]} (ID: {event_id})")
        c.execute('DELETE FROM registrations WHERE event_id = ?', (event_id,))
        c.execute('DELETE FROM events WHERE id = ?', (event_id,))
    
    conn.commit()
    conn.close()
    print(f"✅ Banned words setup complete. Removed {len(spam_events)} spam events.")

if __name__ == "__main__":
    setup_banned_words()
