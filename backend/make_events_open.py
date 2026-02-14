"""
Script to make all existing events open (remove password protection)
"""
import sqlite3
import os

DB_NAME = 'events.db'

def make_events_open():
    if not os.path.exists(DB_NAME):
        print(f"Database {DB_NAME} not found!")
        return
    
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    try:
        # Update all events to be open
        c.execute('UPDATE events SET is_locked = 0, event_password_hash = NULL WHERE is_locked = 1')
        updated = c.rowcount
        conn.commit()
        
        print(f"SUCCESS: Updated {updated} events to be open (no password required)")
        
        # Show current status
        events = c.execute('SELECT id, title, is_locked FROM events').fetchall()
        print("\nCurrent events status:")
        for event in events:
            status = "Locked" if event[2] else "Open"
            print(f"  Event {event[0]}: {event[1]} - {status}")
        
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    make_events_open()
