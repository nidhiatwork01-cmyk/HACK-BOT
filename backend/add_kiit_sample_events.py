"""
Script to add sample events with real KIIT University locations
Run this script to populate the database with sample events
"""

import sqlite3
from datetime import datetime, timedelta
import bcrypt

DB_NAME = 'events.db'

# Real KIIT University locations in Bhubaneswar
KIIT_LOCATIONS = [
    "KIIT Main Auditorium, KIIT University, Bhubaneswar",
    "KIIT Campus, Patia, Bhubaneswar, Odisha",
    "KIIT Library, KIIT University, Bhubaneswar",
    "KIIT School of Computer Engineering, Bhubaneswar",
    "KIIT Convention Centre, Bhubaneswar",
    "KIIT Sports Complex, Bhubaneswar",
    "KIIT School of Management, Bhubaneswar",
    "KIIT Auditorium, Campus 7, Bhubaneswar",
    "KIIT Innovation Lab, Bhubaneswar",
    "KIIT Student Activity Centre, Bhubaneswar"
]

# Sample events with real KIIT locations
SAMPLE_EVENTS = [
    {
        "title": "TechFest 2024 - Hackathon",
        "description": "Join us for the biggest hackathon of the year! 24-hour coding competition with exciting prizes. Open to all KIIT students. Build innovative solutions and showcase your coding skills.",
        "category": "technical",
        "venue": "KIIT Main Auditorium, KIIT University, Bhubaneswar",
        "society": "KIIT Coding Club",
        "date": (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
        "time": "09:00:00",
        "poster_url": "",
        "registration_url": "https://forms.google.com/techfest2024"
    },
    {
        "title": "Cultural Night - Music & Dance",
        "description": "Experience the vibrant culture of KIIT! An evening filled with music, dance performances, and cultural showcases. Food stalls and entertainment throughout the night.",
        "category": "cultural",
        "venue": "KIIT Convention Centre, Bhubaneswar",
        "society": "KIIT Cultural Society",
        "date": (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d'),
        "time": "18:00:00",
        "poster_url": "",
        "registration_url": ""
    },
    {
        "title": "Cricket Tournament Finals",
        "description": "Watch the thrilling finals of the inter-college cricket tournament! Support your team and enjoy an exciting match. Refreshments available.",
        "category": "sports",
        "venue": "KIIT Sports Complex, Bhubaneswar",
        "society": "KIIT Sports Committee",
        "date": (datetime.now() + timedelta(days=5)).strftime('%Y-%m-%d'),
        "time": "15:00:00",
        "poster_url": "",
        "registration_url": ""
    },
    {
        "title": "AI & Machine Learning Workshop",
        "description": "Learn the fundamentals of AI and ML from industry experts. Hands-on sessions with Python, TensorFlow, and real-world projects. Certificate provided.",
        "category": "academic",
        "venue": "KIIT School of Computer Engineering, Bhubaneswar",
        "society": "KIIT AI Club",
        "date": (datetime.now() + timedelta(days=12)).strftime('%Y-%m-%d'),
        "time": "10:00:00",
        "poster_url": "",
        "registration_url": "https://forms.google.com/aiworkshop"
    },
    {
        "title": "Startup Pitch Competition",
        "description": "Pitch your innovative startup ideas to investors and industry leaders. Win funding, mentorship, and incubation opportunities. Open to all KIIT students.",
        "category": "technical",
        "venue": "KIIT Innovation Lab, Bhubaneswar",
        "society": "KIIT Entrepreneurship Cell",
        "date": (datetime.now() + timedelta(days=15)).strftime('%Y-%m-%d'),
        "time": "14:00:00",
        "poster_url": "",
        "registration_url": "https://forms.google.com/startuppitch"
    },
    {
        "title": "Literary Fest - Poetry & Prose",
        "description": "Celebrate literature with poetry recitations, storytelling sessions, and book discussions. Meet published authors and participate in writing competitions.",
        "category": "cultural",
        "venue": "KIIT Library, KIIT University, Bhubaneswar",
        "society": "KIIT Literary Society",
        "date": (datetime.now() + timedelta(days=8)).strftime('%Y-%m-%d'),
        "time": "11:00:00",
        "poster_url": "",
        "registration_url": ""
    },
    {
        "title": "Basketball Championship",
        "description": "Inter-department basketball championship finals. Cheer for your department team and enjoy the competitive spirit. Trophies and medals for winners.",
        "category": "sports",
        "venue": "KIIT Sports Complex, Bhubaneswar",
        "society": "KIIT Sports Committee",
        "date": (datetime.now() + timedelta(days=6)).strftime('%Y-%m-%d'),
        "time": "16:00:00",
        "poster_url": "",
        "registration_url": ""
    },
    {
        "title": "Career Guidance Seminar",
        "description": "Get expert advice on career planning, resume building, and interview preparation. Industry professionals will share insights and answer your questions.",
        "category": "academic",
        "venue": "KIIT School of Management, Bhubaneswar",
        "society": "KIIT Placement Cell",
        "date": (datetime.now() + timedelta(days=9)).strftime('%Y-%m-%d'),
        "time": "13:00:00",
        "poster_url": "",
        "registration_url": "https://forms.google.com/careerseminar"
    },
    {
        "title": "Robotics Workshop",
        "description": "Build and program your own robot! Learn Arduino, sensors, and automation. All materials provided. Perfect for beginners and enthusiasts.",
        "category": "technical",
        "venue": "KIIT Innovation Lab, Bhubaneswar",
        "society": "KIIT Robotics Club",
        "date": (datetime.now() + timedelta(days=11)).strftime('%Y-%m-%d'),
        "time": "09:30:00",
        "poster_url": "",
        "registration_url": "https://forms.google.com/robotics"
    },
    {
        "title": "Dance Competition - Inter College",
        "description": "Showcase your dance talent! Solo and group performances welcome. Judges from the entertainment industry. Cash prizes and trophies.",
        "category": "cultural",
        "venue": "KIIT Student Activity Centre, Bhubaneswar",
        "society": "KIIT Dance Club",
        "date": (datetime.now() + timedelta(days=13)).strftime('%Y-%m-%d'),
        "time": "17:00:00",
        "poster_url": "",
        "registration_url": "https://forms.google.com/dancecomp"
    }
]

def add_sample_events():
    """Add sample events to the database"""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Check if events table exists
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='events'")
    if not c.fetchone():
        print("[ERROR] Events table does not exist. Please run the backend first to initialize the database.")
        conn.close()
        return
    
    # Check if we need to create a default user for events
    c.execute("SELECT id FROM users LIMIT 1")
    user = c.fetchone()
    
    if not user:
        # Create a default admin user for these events
        print("Creating default admin user for sample events...")
        password_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        c.execute('''INSERT INTO users (email, password_hash, name, role) 
                     VALUES (?, ?, ?, ?)''',
                  ('admin@kiit.ac.in', password_hash, 'KIIT Admin', 'admin'))
        conn.commit()
        user_id = c.lastrowid
        print(f"[SUCCESS] Created admin user with ID: {user_id}")
    else:
        user_id = user[0]
        print(f"[SUCCESS] Using existing user ID: {user_id}")
    
    # Add sample events
    added_count = 0
    skipped_count = 0
    
    print("\n[INFO] Adding sample events with real KIIT locations...\n")
    
    for event in SAMPLE_EVENTS:
        # Check if event with same title already exists
        c.execute("SELECT id FROM events WHERE title = ?", (event['title'],))
        if c.fetchone():
            print(f"[SKIP] Skipping: {event['title']} (already exists)")
            skipped_count += 1
            continue
        
        # Insert event
        try:
            c.execute('''INSERT INTO events 
                        (title, description, category, date, time, venue, poster_url, registration_url, society, created_by, is_locked, is_expired)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                     (event['title'], event['description'], event['category'], 
                      event['date'], event['time'], event['venue'],
                      event.get('poster_url', ''), event.get('registration_url', ''),
                      event.get('society', ''), user_id, 0, 0))
            conn.commit()
            added_count += 1
            print(f"[SUCCESS] Added: {event['title']}")
            print(f"   Location: {event['venue']}")
            print(f"   Date: {event['date']} at {event['time']}\n")
        except Exception as e:
            print(f"[ERROR] Error adding {event['title']}: {str(e)}")
            skipped_count += 1
    
    conn.close()
    
    print("\n" + "="*60)
    print(f"[SUCCESS] Successfully added {added_count} events")
    if skipped_count > 0:
        print(f"[SKIP] Skipped {skipped_count} events (already exist)")
    print("="*60)
    print("\n[SUCCESS] Sample events with real KIIT locations have been added!")
    print("[INFO] All locations are real places in KIIT University, Bhubaneswar")
    print("\n[TIP] You can now:")
    print("   1. View events at http://localhost:3000/events")
    print("   2. Click on any event to see map directions")
    print("   3. Use 'Get Directions' to navigate to KIIT locations")

if __name__ == '__main__':
    print("="*60)
    print("KIIT University Sample Events Generator")
    print("="*60)
    print("\nThis script will add sample events with real KIIT locations")
    print("to your database.\n")
    
    try:
        add_sample_events()
    except Exception as e:
        print(f"\n[ERROR] Error: {str(e)}")
        print("\nMake sure:")
        print("1. The backend has been run at least once (to create the database)")
        print("2. You're running this from the backend directory")
        print("3. The events.db file exists")

