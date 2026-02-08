from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import sqlite3
import os
import json

app = FastAPI(title="Campus Event Navigator API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DB_NAME = os.path.join(os.path.dirname(__file__), 'events.db')

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT,
            venue TEXT,
            poster_url TEXT,
            society TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            interested_count INTEGER DEFAULT 0
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS interests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER,
            user_id TEXT,
            FOREIGN KEY (event_id) REFERENCES events(id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Models
class Event(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    category: str
    date: str
    time: Optional[str] = None
    venue: Optional[str] = None
    poster_url: Optional[str] = None
    society: str
    interested_count: int = 0

class InterestRequest(BaseModel):
    event_id: int
    user_id: str

# Routes
@app.get("/")
def read_root():
    return {"message": "Campus Event Navigator API"}

@app.get("/api/events", response_model=List[Event])
def get_events(category: Optional[str] = None, date_filter: Optional[str] = None):
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    query = "SELECT * FROM events WHERE 1=1"
    params = []
    
    if category:
        query += " AND category = ?"
        params.append(category)
    
    if date_filter:
        query += " AND date >= ?"
        params.append(date_filter)
    
    query += " ORDER BY date ASC, time ASC"
    
    c.execute(query, params)
    events = [dict(row) for row in c.fetchall()]
    conn.close()
    return events

@app.get("/api/events/{event_id}", response_model=Event)
def get_event(event_id: int):
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM events WHERE id = ?", (event_id,))
    event = c.fetchone()
    conn.close()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return dict(event)

@app.post("/api/events", response_model=Event)
def create_event(event: Event):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        INSERT INTO events (title, description, category, date, time, venue, poster_url, society)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (event.title, event.description, event.category, event.date, 
          event.time, event.venue, event.poster_url, event.society))
    conn.commit()
    event_id = c.lastrowid
    conn.close()
    
    return {**event.dict(), "id": event_id}

@app.post("/api/events/interested")
def toggle_interest(request: InterestRequest):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Check if already interested
    c.execute('''
        SELECT id FROM interests WHERE event_id = ? AND user_id = ?
    ''', (request.event_id, request.user_id))
    
    existing = c.fetchone()
    
    if existing:
        # Remove interest
        c.execute('''
            DELETE FROM interests WHERE event_id = ? AND user_id = ?
        ''', (request.event_id, request.user_id))
        c.execute('''
            UPDATE events SET interested_count = interested_count - 1 WHERE id = ?
        ''', (request.event_id,))
        action = "removed"
    else:
        # Add interest
        c.execute('''
            INSERT INTO interests (event_id, user_id) VALUES (?, ?)
        ''', (request.event_id, request.user_id))
        c.execute('''
            UPDATE events SET interested_count = interested_count + 1 WHERE id = ?
        ''', (request.event_id,))
        action = "added"
    
    conn.commit()
    
    # Get updated count
    c.execute('SELECT interested_count FROM events WHERE id = ?', (request.event_id,))
    count = c.fetchone()[0]
    conn.close()
    
    return {"action": action, "interested_count": count, "is_interested": action == "added"}

@app.get("/api/events/{event_id}/interested")
def check_interest(event_id: int, user_id: str):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        SELECT id FROM interests WHERE event_id = ? AND user_id = ?
    ''', (event_id, user_id))
    is_interested = c.fetchone() is not None
    conn.close()
    return {"is_interested": is_interested}

@app.get("/api/categories")
def get_categories():
    return {
        "categories": ["Technical", "Cultural", "Sports", "Academic", "Workshop", "Seminar", "Hackathon", "Other"]
    }

@app.get("/api/analytics/popular")
def get_popular_events(limit: int = 5):
    conn = sqlite3.connect('events.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('''
        SELECT * FROM events ORDER BY interested_count DESC LIMIT ?
    ''', (limit,))
    events = [dict(row) for row in c.fetchall()]
    conn.close()
    return events

@app.get("/api/analytics/categories")
def get_category_stats():
    conn = sqlite3.connect('events.db')
    c = conn.cursor()
    c.execute('''
        SELECT category, COUNT(*) as count, AVG(interested_count) as avg_interest
        FROM events GROUP BY category
    ''')
    stats = [{"category": row[0], "count": row[1], "avg_interest": round(row[2], 1)} 
             for row in c.fetchall()]
    conn.close()
    return stats

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

