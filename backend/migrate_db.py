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
        
        # Add registration_url if it doesn't exist
        if 'registration_url' not in columns:
            print("Adding registration_url column...")
            c.execute('ALTER TABLE events ADD COLUMN registration_url TEXT')
        
        # Check registrations table
        c.execute("PRAGMA table_info(registrations)")
        reg_columns = [row[1] for row in c.fetchall()]
        
        # Add user_id if it doesn't exist
        if 'user_id' not in reg_columns:
            print("Adding user_id column to registrations...")
            c.execute('ALTER TABLE registrations ADD COLUMN user_id INTEGER')
        
        # Check users table for role column
        c.execute("PRAGMA table_info(users)")
        user_columns = [row[1] for row in c.fetchall()]
        
        if 'role' not in user_columns:
            print("Adding role column to users...")
            c.execute('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "student"')
        
        if 'society_name' not in user_columns:
            print("Adding society_name column to users...")
            c.execute('ALTER TABLE users ADD COLUMN society_name TEXT')
        
        # Create event_requests table if it doesn't exist
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='event_requests'")
        if not c.fetchone():
            print("Creating event_requests table...")
            c.execute('''CREATE TABLE event_requests
                         (id INTEGER PRIMARY KEY AUTOINCREMENT,
                          user_id INTEGER,
                          user_email TEXT,
                          request_text TEXT NOT NULL,
                          category_detected TEXT,
                          sentiment TEXT,
                          auto_response TEXT,
                          status TEXT DEFAULT 'pending',
                          admin_response TEXT,
                          admin_id INTEGER,
                          society_name TEXT,
                          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                          responded_at TEXT,
                          FOREIGN KEY (user_id) REFERENCES users(id),
                          FOREIGN KEY (admin_id) REFERENCES users(id))''')
        else:
            # Check if society_name column exists
            c.execute("PRAGMA table_info(event_requests)")
            req_columns = [row[1] for row in c.fetchall()]
            if 'society_name' not in req_columns:
                print("Adding society_name column to event_requests...")
                c.execute('ALTER TABLE event_requests ADD COLUMN society_name TEXT')
        
        conn.commit()
        print("SUCCESS: Database migration completed successfully!")
        
    except Exception as e:
        print(f"ERROR: Error during migration: {str(e)}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    print("Migrating database...")
    migrate_database()

