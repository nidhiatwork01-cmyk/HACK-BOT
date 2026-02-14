"""
Database migration script to add new columns for authentication
Run this once to update your existing database
"""
import sqlite3

DB_NAME = 'events.db'

def migrate_database():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    try:
        # Check if columns exist
        c.execute("PRAGMA table_info(events)")
        columns = [row[1] for row in c.fetchall()]
        
        # Add created_by if it doesn't exist
        if 'created_by' not in columns:
            print("Adding created_by column...")
            c.execute('ALTER TABLE events ADD COLUMN created_by INTEGER')
        
        # Add event_password_hash if it doesn't exist
        if 'event_password_hash' not in columns:
            print("Adding event_password_hash column...")
            c.execute('ALTER TABLE events ADD COLUMN event_password_hash TEXT')
        
        # Add is_locked if it doesn't exist
        if 'is_locked' not in columns:
            print("Adding is_locked column...")
            c.execute('ALTER TABLE events ADD COLUMN is_locked INTEGER DEFAULT 0')
        
        # Add is_expired if it doesn't exist
        if 'is_expired' not in columns:
            print("Adding is_expired column...")
            c.execute('ALTER TABLE events ADD COLUMN is_expired INTEGER DEFAULT 0')
        
        # Check users table
        c.execute("PRAGMA table_info(users)")
        user_columns = [row[1] for row in c.fetchall()]
        
        if 'role' not in user_columns:
            print("Adding role column to users...")
            c.execute('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "student"')
        
        if 'society_name' not in user_columns:
            print("Adding society_name column to users...")
            c.execute('ALTER TABLE users ADD COLUMN society_name TEXT')
        
        # Create registrations table if it doesn't exist
        c.execute('''CREATE TABLE IF NOT EXISTS registrations
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      event_id INTEGER,
                      user_id INTEGER,
                      registered_at TEXT DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (event_id) REFERENCES events(id),
                      FOREIGN KEY (user_id) REFERENCES users(id))''')
        
        # Create banned_words table if it doesn't exist
        c.execute('''CREATE TABLE IF NOT EXISTS banned_words
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      word TEXT UNIQUE NOT NULL,
                      added_by INTEGER,
                      reason TEXT,
                      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (added_by) REFERENCES users(id))''')
        
        # Create assistant_requests table
        c.execute('''CREATE TABLE IF NOT EXISTS assistant_requests
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      user_id INTEGER,
                      request_text TEXT NOT NULL,
                      response_text TEXT,
                      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (user_id) REFERENCES users(id))''')
        
        conn.commit()
        print("✅ Database migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
