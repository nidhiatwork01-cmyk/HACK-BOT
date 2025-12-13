"""Direct script to delete an event from the database"""
import sqlite3
import sys

DB_NAME = 'events.db'

def delete_event_direct(event_id):
    """Delete an event directly from the database"""
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        
        # Check if event exists
        event = c.execute('SELECT id, title, created_by FROM events WHERE id = ?', (event_id,)).fetchone()
        if not event:
            print(f"Event {event_id} not found")
            conn.close()
            return False
        
        print(f"Found event: {event[1]} (ID: {event[0]}, Created by: {event[2]})")
        
        # Delete registrations first
        c.execute('DELETE FROM registrations WHERE event_id = ?', (event_id,))
        regs_deleted = c.rowcount
        
        # Delete the event
        c.execute('DELETE FROM events WHERE id = ?', (event_id,))
        events_deleted = c.rowcount
        
        conn.commit()
        conn.close()
        
        if events_deleted > 0:
            print(f"Successfully deleted event {event_id}")
            print(f"  - Deleted {regs_deleted} registrations")
            print(f"  - Deleted {events_deleted} event(s)")
            return True
        else:
            print(f"Failed to delete event {event_id}")
            return False
            
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python delete_event_direct.py <event_id>")
        print("Example: python delete_event_direct.py 6")
        sys.exit(1)
    
    event_id = int(sys.argv[1])
    delete_event_direct(event_id)

