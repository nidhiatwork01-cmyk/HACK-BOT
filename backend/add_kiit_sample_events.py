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
        "category": "Technical",
        "date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
        "time": "09:00",
        "venue": KIIT_LOCATIONS[0],
        "poster_url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        "registration_url": "https://forms.gle/example1",
        "society": "Tech Club"
    },
    {
        "title": "Cultural Night 2024",
        "description": "An evening of music, dance, and drama celebrating diverse cultures. Performances by talented KIIT students. Don't miss this spectacular show!",
        "category": "Cultural",
        "date": (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d"),
        "time": "18:00",
        "venue": KIIT_LOCATIONS[4],
        "poster_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
        "registration_url": "https://forms.gle/example2",
        "society": "Cultural Society"
    },
    {
        "title": "Cricket Tournament Finals",
        "description": "Inter-college cricket tournament finals. Witness the best teams compete for the championship trophy. Free entry for all students with valid ID.",
        "category": "Sports",
        "date": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "time": "14:00",
        "venue": KIIT_LOCATIONS[5],
        "poster_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
        "registration_url": "https://forms.gle/example3",
        "society": "Sports Committee"
    },
    {
        "title": "AI/ML Workshop Series",
        "description": "3-day intensive workshop on Artificial Intelligence and Machine Learning. Learn from industry experts and work on real-world projects. Certificate provided.",
        "category": "Technical",
        "date": (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d"),
        "time": "10:00",
        "venue": KIIT_LOCATIONS[3],
        "poster_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
        "registration_url": "https://forms.gle/example4",
        "society": "AI Club"
    },
    {
        "title": "Photography Competition",
        "description": "Capture the beauty of KIIT campus! Theme: 'Campus Life'. Prizes for top 3 winners and exhibition of selected entries. Submit entries by deadline.",
        "category": "Cultural",
        "date": (datetime.now() + timedelta(days=20)).strftime("%Y-%m-%d"),
        "time": "11:00",
        "venue": KIIT_LOCATIONS[8],
        "poster_url": "https://images.unsplash.com/photo-1452587925148-ce544e77e70d",
        "registration_url": "https://forms.gle/example5",
        "society": "Photography Club"
    },
    {
        "title": "Entrepreneurship Summit",
        "description": "Learn from successful entrepreneurs, network with startup founders, and pitch your ideas. Investors and mentors will be present. Great opportunity for aspiring entrepreneurs.",
        "category": "Technical",
        "date": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
        "time": "09:30",
        "venue": KIIT_LOCATIONS[6],
        "poster_url": "https://images.unsplash.com/photo-1559136555-9303baea8ebd",
        "registration_url": "https://forms.gle/example6",
        "society": "E-Cell"
    },
    {
        "title": "Blood Donation Camp",
        "description": "Save lives by donating blood. Free health checkup for all donors. Organized in collaboration with Red Cross. Your one donation can save three lives.",
        "category": "Social",
        "date": (datetime.now() + timedelta(days=12)).strftime("%Y-%m-%d"),
        "time": "08:00",
        "venue": KIIT_LOCATIONS[1],
        "poster_url": "https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40",
        "registration_url": "https://forms.gle/example7",
        "society": "NSS"
    },
    {
        "title": "Debate Competition",
        "description": "Annual inter-college debate competition. Topic will be announced on the day. Prizes and certificates for winners. Sharpen your public speaking skills!",
        "category": "Cultural",
        "date": (datetime.now() + timedelta(days=18)).strftime("%Y-%m-%d"),
        "time": "15:00",
        "venue": KIIT_LOCATIONS[7],
        "poster_url": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2",
        "registration_url": "https://forms.gle/example8",
        "society": "Debate Society"
    },
    {
        "title": "Yoga & Wellness Workshop",
        "description": "Learn yoga, meditation, and stress management techniques. Certified instructors will guide you. Improve your mental and physical health. Mats provided.",
        "category": "Sports",
        "date": (datetime.now() + timedelta(days=8)).strftime("%Y-%m-%d"),
        "time": "06:00",
        "venue": KIIT_LOCATIONS[5],
        "poster_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        "registration_url": "https://forms.gle/example9",
        "society": "Wellness Club"
    },
    {
        "title": "Career Fair 2024",
        "description": "Meet recruiters from top companies. Bring your resume and dress professionally. On-spot interviews and internship opportunities. Don't miss this chance!",
        "category": "Academic",
        "date": (datetime.now() + timedelta(days=25)).strftime("%Y-%m-%d"),
        "time": "10:00",
        "venue": KIIT_LOCATIONS[4],
        "poster_url": "https://images.unsplash.com/photo-1521737711867-e3b97375f902",
        "registration_url": "https://forms.gle/example10",
        "society": "Placement Cell"
    }
]

def create_sample_user():
    """Create a sample user for testing"""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Check if user exists
    existing = c.execute("SELECT id FROM users WHERE email = ?", ("admin@kiit.ac.in",)).fetchone()
    if existing:
        conn.close()
        return existing[0]
    
    # Create admin user
    password_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    c.execute("""INSERT INTO users (email, password_hash, name, role, society_name)
                 VALUES (?, ?, ?, ?, ?)""",
              ("admin@kiit.ac.in", password_hash, "Admin User", "admin", "KIIT Administration"))
    user_id = c.lastrowid
    conn.commit()
    conn.close()
    return user_id

def add_sample_events():
    """Add sample events to the database"""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Create a sample user first
    user_id = create_sample_user()
    
    added_count = 0
    for event in SAMPLE_EVENTS:
        try:
            c.execute("""
                INSERT INTO events (title, description, category, date, time, venue,
                                  poster_url, registration_url, society, created_by, is_locked, is_expired)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
            """, (
                event["title"],
                event["description"],
                event["category"],
                event["date"],
                event["time"],
                event["venue"],
                event["poster_url"],
                event["registration_url"],
                event["society"],
                user_id
            ))
            added_count += 1
            print(f"✅ Added: {event['title']}")
        except sqlite3.IntegrityError:
            print(f"⚠️  Event already exists: {event['title']}")
        except Exception as e:
            print(f"❌ Error adding {event['title']}: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"\n✅ Successfully added {added_count} sample events!")
    print(f"📧 Test user created: admin@kiit.ac.in (password: admin123)")

if __name__ == "__main__":
    add_sample_events()
