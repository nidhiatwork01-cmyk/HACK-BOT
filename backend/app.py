from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import sqlite3
import os
import json
import jwt
import bcrypt
import re
from functools import wraps

try:
    # When imported as a package (e.g., `gunicorn backend.app:app`)
    from backend.ml_assistant import assistant
    from backend.ml_recommender import recommender
    from backend.ml_search import semantic_search
    from backend.ml_description_enhancer import description_enhancer
    from backend.ml_success_predictor import success_predictor
except ImportError:  # Fallback for running from `backend/` directly
    from ml_assistant import assistant
    from ml_recommender import recommender
    from ml_search import semantic_search
    from ml_description_enhancer import description_enhancer
    from ml_success_predictor import success_predictor

# Configure Flask to serve static files from frontend
import os.path

# Build paths based on environment
# Check Docker path first (where Dockerfile copies frontend build)
if os.path.exists("frontend/dist"):
    static_folder = os.path.abspath("frontend/dist")
elif os.path.exists("../frontend/dist"):
    static_folder = os.path.abspath("../frontend/dist")
else:
    static_folder = None

app = Flask(__name__, static_folder=static_folder, static_url_path="/")
# CORS configuration - allow frontend domains
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://localhost:5173",
                "https://*.azurewebsites.net",
                "https://*.azurestaticapps.net",
                os.environ.get("FRONTEND_URL", "*"),
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    },
)
app.config["SECRET_KEY"] = os.environ.get(
    "SECRET_KEY", "your-secret-key-change-in-production-2024"
)

DB_NAME = os.path.join(os.path.dirname(__file__), "events.db")

# School email domains (customize for your school)
SCHOOL_EMAIL_DOMAINS = ["kiit.ac.in"]  # Only KIIT email addresses allowed

# Secret keys for privileged access (change these in production!)
FACULTY_SECRET_KEY = os.environ.get("FACULTY_SECRET_KEY", "faculty-secret-2024")
KSAC_SECRET_KEY = os.environ.get("KSAC_SECRET_KEY", "hiiamfromksac")
SOCIETY_PRESIDENT_SECRET_KEY = os.environ.get(
    "SOCIETY_PRESIDENT_SECRET_KEY", "society-secret-2024"
)
ADMIN_SECRET_KEY = os.environ.get("ADMIN_SECRET_KEY", "admin-secret-2024")


def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()

    # Users table
    c.execute("""CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  email TEXT UNIQUE NOT NULL,
                  password_hash TEXT NOT NULL,
                  name TEXT,
                  role TEXT DEFAULT 'student',
                  society_name TEXT,
                  created_at TEXT DEFAULT CURRENT_TIMESTAMP)""")

    # Events table
    c.execute("""CREATE TABLE IF NOT EXISTS events
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  title TEXT NOT NULL,
                  description TEXT,
                  category TEXT NOT NULL,
                  date TEXT NOT NULL,
                  time TEXT NOT NULL,
                  venue TEXT NOT NULL,
                  poster_url TEXT,
                  registration_url TEXT,
                  society TEXT,
                  created_by INTEGER,
                  event_password_hash TEXT,
                  is_locked INTEGER DEFAULT 0,
                  is_expired INTEGER DEFAULT 0,
                  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (created_by) REFERENCES users(id))""")

    # Migrate: Add is_expired column if it doesn't exist
    c.execute("PRAGMA table_info(events)")
    columns = [row[1] for row in c.fetchall()]
    if "is_expired" not in columns:
        try:
            c.execute("ALTER TABLE events ADD COLUMN is_expired INTEGER DEFAULT 0")
            conn.commit()
            print("✅ Added is_expired column to events table")
        except Exception as e:
            print(f"Note: is_expired column may already exist: {e}")

    # Migrate: Add location columns for precise navigation
    location_columns = [
        "location_id",
        "location_lat",
        "location_lng",
        "location_address",
    ]
    for col in location_columns:
        if col not in columns:
            try:
                if col == "location_id":
                    c.execute("ALTER TABLE events ADD COLUMN location_id TEXT")
                elif col == "location_lat":
                    c.execute("ALTER TABLE events ADD COLUMN location_lat REAL")
                elif col == "location_lng":
                    c.execute("ALTER TABLE events ADD COLUMN location_lng REAL")
                elif col == "location_address":
                    c.execute("ALTER TABLE events ADD COLUMN location_address TEXT")
                conn.commit()
                print(f"✅ Added {col} column to events table")
            except Exception as e:
                print(f"Note: {col} column may already exist: {e}")

    # Registrations table
    c.execute("""CREATE TABLE IF NOT EXISTS registrations
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  event_id INTEGER,
                  user_id INTEGER,
                  user_email TEXT,
                  registered_at TEXT DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (event_id) REFERENCES events(id),
                  FOREIGN KEY (user_id) REFERENCES users(id))""")

    # Event Requests table (for AI assistant)
    c.execute("""CREATE TABLE IF NOT EXISTS event_requests
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
                  FOREIGN KEY (admin_id) REFERENCES users(id))""")

    # Banned Words table (for content moderation)
    c.execute("""CREATE TABLE IF NOT EXISTS banned_words
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  word TEXT UNIQUE NOT NULL,
                  added_by INTEGER,
                  reason TEXT,
                  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (added_by) REFERENCES users(id))""")

    conn.commit()
    conn.close()


def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def check_banned_words(text):
    """Check if text contains any banned words (case-insensitive)"""
    if not text:
        return None

    conn = get_db()
    c = conn.cursor()

    # Check if table exists first
    try:
        c.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='banned_words'"
        )
        table_exists = c.fetchone() is not None

        if not table_exists:
            # Create table if it doesn't exist
            c.execute("""CREATE TABLE IF NOT EXISTS banned_words
                         (id INTEGER PRIMARY KEY AUTOINCREMENT,
                          word TEXT UNIQUE NOT NULL,
                          added_by INTEGER,
                          reason TEXT,
                          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (added_by) REFERENCES users(id))""")
            conn.commit()

        # Get all banned words
        banned_words = c.execute("SELECT word FROM banned_words").fetchall()
        conn.close()

        if not banned_words:
            return None

        text_lower = text.lower()

        # Check each banned word (improved matching with word boundaries)
        import re

        for word_row in banned_words:
            word = word_row["word"].lower().strip()
            if word:
                # Check if word appears as a whole word (not just substring)
                # This prevents false positives like "spam" matching "spamalot"
                # but still catches "spam" in "this is spam" or "spam hackathon"
                pattern = r"\b" + re.escape(word) + r"\b"
                if re.search(pattern, text_lower):
                    return word
                # Also check as substring for cases where it's part of compound words
                if word in text_lower:
                    return word

        return None
    except Exception as e:
        print(f"Error checking banned words: {str(e)}")
        conn.close()
        return None


# Authentication helpers
def validate_school_email(email):
    """Validate if email is from school domain"""
    if not email or "@" not in email:
        return False
    domain = email.split("@")[1].lower()
    return domain in [d.lower() for d in SCHOOL_EMAIL_DOMAINS]


def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password, password_hash):
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def generate_token(user_id, email, role="student"):
    """Generate JWT token"""
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=7),
    }
    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")


def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def require_auth(f):
    """Decorator to require authentication"""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "No token provided"}), 401

        if token.startswith("Bearer "):
            token = token[7:]

        payload = verify_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        request.user_id = payload["user_id"]
        request.user_email = payload["email"]
        request.user_role = payload.get("role", "student")
        return f(*args, **kwargs)

    return decorated


def require_role(*allowed_roles):
    """Decorator to require specific role(s)"""

    def decorator(f):
        @wraps(f)
        @require_auth
        def decorated(*args, **kwargs):
            if request.user_role not in allowed_roles:
                return jsonify({"error": "Insufficient permissions"}), 403
            return f(*args, **kwargs)

        return decorated

    return decorator


@app.route("/api/events", methods=["GET"])
def get_events():
    conn = get_db()
    c = conn.cursor()

    category = request.args.get("category")
    search = request.args.get("search")

    # Check which columns exist
    c.execute("PRAGMA table_info(events)")
    columns = [row[1] for row in c.fetchall()]
    has_registration_url = "registration_url" in columns
    has_is_expired = "is_expired" in columns
    has_location = "location_id" in columns

    # Build SELECT query with available columns
    base_fields = [
        "e.id",
        "e.title",
        "e.description",
        "e.category",
        "e.date",
        "e.time",
        "e.venue",
        "e.poster_url",
        "e.society",
        "e.created_by",
        "e.is_locked",
        "e.created_at",
    ]

    if has_registration_url:
        base_fields.insert(8, "e.registration_url")
    else:
        base_fields.insert(8, "NULL as registration_url")

    if has_is_expired:
        base_fields.append("e.is_expired")
    else:
        base_fields.append("0 as is_expired")

    if has_location:
        base_fields.extend(
            ["e.location_id", "e.location_lat", "e.location_lng", "e.location_address"]
        )

    base_fields.append(
        "(SELECT COUNT(*) FROM registrations WHERE event_id = e.id) as registration_count"
    )

    query = f"""SELECT {", ".join(base_fields)} FROM events e WHERE 1=1"""

    params = []

    # Filter out expired events by default (unless explicitly requested)
    show_expired = request.args.get("show_expired", "false").lower() == "true"
    if not show_expired:
        if has_is_expired:
            query += " AND (e.is_expired = 0 OR e.is_expired IS NULL)"
        else:
            # Auto-detect expired events based on date/time
            query += " AND (datetime(e.date || ' ' || e.time) >= datetime('now'))"

    if category and category != "all":
        query += " AND e.category = ?"
        params.append(category)

    if search:
        query += " AND (e.title LIKE ? OR e.description LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])

    query += " ORDER BY e.date, e.time"

    try:
        events = c.execute(query, params).fetchall()
        conn.close()

        # Convert to list of dicts
        events_list = []
        for event in events:
            event_dict = dict(event)
            # Ensure registration_count is a number
            if "registration_count" in event_dict:
                event_dict["registration_count"] = event_dict["registration_count"] or 0
            events_list.append(event_dict)

        return jsonify(events_list)
    except Exception as e:
        import traceback

        error_details = traceback.format_exc()
        print(f"Error fetching events: {str(e)}")
        print(f"Traceback: {error_details}")
        conn.close()
        # Fallback to simpler query
        try:
            conn = get_db()
            c = conn.cursor()
            events = c.execute("SELECT * FROM events ORDER BY date, time").fetchall()
            conn.close()
            return jsonify([dict(event) for event in events])
        except Exception as e2:
            print(f"Fallback query also failed: {str(e2)}")
            return jsonify({"error": "Failed to fetch events", "details": str(e)}), 500


@app.route("/api/events", methods=["POST"])
@require_auth
def create_event():
    try:
        if not request.json:
            return jsonify({"error": "No data provided"}), 400

        data = request.json

        # Validate required fields
        required_fields = ["title", "description", "category", "date", "time", "venue"]
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Check for banned words in title and description
        title_text = f"{data.get('title', '')} {data.get('description', '')} {data.get('society', '')} {data.get('venue', '')}"
        banned_word = check_banned_words(title_text)

        # Debug logging
        print(f"🔍 Checking banned words in: {title_text[:100]}...")
        print(f"🔍 Banned word detected: {banned_word}")

        if banned_word:
            print(
                f"❌ BLOCKED: Event creation blocked due to banned word: {banned_word}"
            )
            return jsonify(
                {
                    "error": "Cannot create event: This event goes against our rules",
                    "details": f"The content contains inappropriate language and cannot be published.",
                    "banned_word_detected": banned_word,
                    "violates_rules": True,
                }
            ), 400

        conn = get_db()
        c = conn.cursor()

        # Handle event password (optional - events are open by default)
        event_password_hash = None
        is_locked = 0
        # Only lock if password is explicitly provided
        if data.get("event_password") and data.get("event_password").strip():
            event_password_hash = hash_password(data["event_password"])
            is_locked = 1

        # Check if location data is provided (for privileged users)
        location_id = data.get("location_id")
        location_lat = data.get("location_lat")
        location_lng = data.get("location_lng")
        location_address = data.get("location_address")

        # Check if location columns exist
        c.execute("PRAGMA table_info(events)")
        columns = [row[1] for row in c.fetchall()]
        has_location_columns = "location_id" in columns

        if has_location_columns:
            c.execute(
                """INSERT INTO events (title, description, category, date, time, venue, poster_url, registration_url, society, created_by, event_password_hash, is_locked, location_id, location_lat, location_lng, location_address)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    data["title"],
                    data["description"],
                    data["category"],
                    data["date"],
                    data["time"],
                    data["venue"],
                    data.get("poster_url", ""),
                    data.get("registration_url", ""),
                    data.get("society", ""),
                    request.user_id,
                    event_password_hash,
                    is_locked,
                    location_id,
                    location_lat,
                    location_lng,
                    location_address,
                ),
            )
        else:
            c.execute(
                """INSERT INTO events (title, description, category, date, time, venue, poster_url, registration_url, society, created_by, event_password_hash, is_locked)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    data["title"],
                    data["description"],
                    data["category"],
                    data["date"],
                    data["time"],
                    data["venue"],
                    data.get("poster_url", ""),
                    data.get("registration_url", ""),
                    data.get("society", ""),
                    request.user_id,
                    event_password_hash,
                    is_locked,
                ),
            )

        conn.commit()
        event_id = c.lastrowid
        conn.close()

        return jsonify({"id": event_id, "message": "Event created successfully"}), 201
    except Exception as e:
        print(f"Error creating event: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    try:
        conn = get_db()
        c = conn.cursor()

        # Check if is_expired and location columns exist
        c.execute("PRAGMA table_info(events)")
        columns = [row[1] for row in c.fetchall()]
        has_is_expired = "is_expired" in columns
        has_location = "location_id" in columns

        # Build SELECT query based on available columns
        select_fields = [
            "id",
            "title",
            "description",
            "category",
            "date",
            "time",
            "venue",
            "poster_url",
            "registration_url",
            "society",
            "created_by",
            "is_locked",
            "created_at",
        ]
        if has_is_expired:
            select_fields.insert(-1, "is_expired")
        if has_location:
            select_fields.extend(
                ["location_id", "location_lat", "location_lng", "location_address"]
            )

        query = f"SELECT {', '.join(select_fields)} FROM events WHERE id = ?"
        event = c.execute(query, (event_id,)).fetchone()

        conn.close()

        if event:
            event_dict = dict(event)
            # Ensure is_locked is 0 or 1 (not None)
            if event_dict.get("is_locked") is None:
                event_dict["is_locked"] = 0
            # Ensure is_expired is 0 or 1 (not None)
            if "is_expired" not in event_dict:
                event_dict["is_expired"] = 0
            elif event_dict.get("is_expired") is None:
                event_dict["is_expired"] = 0
            return jsonify(event_dict)
        return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        print(f"Error fetching event: {str(e)}")
        import traceback

        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/api/events/<int:event_id>", methods=["DELETE"])
@require_auth
def delete_event(event_id):
    """Delete an event (only creator or admin can delete)"""
    try:
        print(f"🗑️ DELETE request received for event {event_id}")
        print(f"   User ID: {request.user_id}, Role: {request.user_role}")

        conn = get_db()
        c = conn.cursor()

        # Check if event exists and get creator info
        event = c.execute(
            "SELECT created_by FROM events WHERE id = ?", (event_id,)
        ).fetchone()
        if not event:
            print(f"   ❌ Event {event_id} not found")
            conn.close()
            return jsonify({"error": "Event not found"}), 404

        # Convert to dict and get created_by
        event_dict = dict(event)
        event_creator_id = event_dict.get("created_by")
        current_user_id = request.user_id

        # Debug logging
        print(
            f"DEBUG: Event creator ID: {event_creator_id} (type: {type(event_creator_id)})"
        )
        print(
            f"DEBUG: Current user ID: {current_user_id} (type: {type(current_user_id)})"
        )
        print(f"DEBUG: User role: {request.user_role}")

        # Check if user is the creator or has admin privileges
        # Also allow deletion if created_by is None (orphaned events)
        is_creator = False
        if event_creator_id is not None:
            try:
                is_creator = int(event_creator_id) == int(current_user_id)
            except (ValueError, TypeError):
                is_creator = False

        is_admin = request.user_role in ["admin", "faculty", "ksac_member"]
        is_orphaned = (
            event_creator_id is None
        )  # Allow deletion of orphaned events by any authenticated user

        if not is_creator and not is_admin and not is_orphaned:
            conn.close()
            return jsonify(
                {
                    "error": "Unauthorized: Only event creator or admin can delete events",
                    "details": f"Event created by: {event_creator_id}, Your ID: {current_user_id}",
                }
            ), 403

        # Delete all registrations for this event first (cascade delete)
        c.execute("DELETE FROM registrations WHERE event_id = ?", (event_id,))
        registrations_deleted = c.rowcount

        # Delete the event
        c.execute("DELETE FROM events WHERE id = ?", (event_id,))
        events_deleted = c.rowcount

        if events_deleted == 0:
            conn.close()
            return jsonify({"error": "Event not found or could not be deleted"}), 404

        conn.commit()
        conn.close()

        print(
            f"✅ Successfully deleted event {event_id} and {registrations_deleted} registrations"
        )
        return jsonify(
            {
                "message": "Event deleted successfully",
                "registrations_deleted": registrations_deleted,
            }
        ), 200

    except Exception as e:
        import traceback

        error_details = traceback.format_exc()
        print(f"❌ ERROR deleting event {event_id}: {str(e)}")
        print(f"Full traceback:\n{error_details}")
        try:
            conn.close()
        except:
            pass
        return jsonify(
            {
                "error": "Failed to delete event",
                "details": str(e),
                "traceback": error_details if app.debug else None,
            }
        ), 500


@app.route("/api/events/<int:event_id>/expire", methods=["POST"])
@require_auth
def mark_event_expired(event_id):
    """Mark an event as expired (only creator or admin can mark as expired)"""
    try:
        conn = get_db()
        c = conn.cursor()

        # Check if is_expired column exists, if not, add it
        c.execute("PRAGMA table_info(events)")
        columns = [row[1] for row in c.fetchall()]
        if "is_expired" not in columns:
            try:
                c.execute("ALTER TABLE events ADD COLUMN is_expired INTEGER DEFAULT 0")
                conn.commit()
            except Exception as e:
                print(f"Note: is_expired column may already exist: {e}")

        # Check if event exists and get creator info
        event = c.execute(
            "SELECT created_by FROM events WHERE id = ?", (event_id,)
        ).fetchone()
        if not event:
            conn.close()
            return jsonify({"error": "Event not found"}), 404

        # Check if user is the creator or has admin privileges
        if event["created_by"] != request.user_id and request.user_role not in [
            "admin",
            "faculty",
            "ksac_member",
        ]:
            conn.close()
            return jsonify(
                {
                    "error": "Unauthorized: Only event creator or admin can mark events as expired"
                }
            ), 403

        # Get the expire status from request body (default to True)
        data = request.json or {}
        is_expired = data.get("is_expired", True)

        # Update the event
        c.execute(
            "UPDATE events SET is_expired = ? WHERE id = ?",
            (1 if is_expired else 0, event_id),
        )

        if c.rowcount == 0:
            conn.close()
            return jsonify({"error": "Event not found"}), 404

        conn.commit()
        conn.close()

        return jsonify(
            {
                "message": f"Event marked as {'expired' if is_expired else 'active'} successfully",
                "is_expired": bool(is_expired),
            }
        ), 200

    except Exception as e:
        import traceback

        print(f"Error marking event as expired: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/api/events/<int:event_id>/register", methods=["POST"])
@require_auth
def register_event(event_id):
    try:
        data = request.json or {}
        conn = get_db()
        c = conn.cursor()

        # Check if event exists
        event = c.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
        if not event:
            conn.close()
            return jsonify({"error": "Event not found"}), 404

        # Convert Row to dict
        event_dict = dict(event)

        # Check if event is password protected (only if explicitly locked)
        is_locked = event_dict.get("is_locked", 0)
        if is_locked == 1:
            password = data.get("event_password")
            if not password:
                conn.close()
                return jsonify(
                    {"error": "Event password required", "requires_password": True}
                ), 403

            event_password_hash = event_dict.get("event_password_hash", "")
            if event_password_hash and not verify_password(
                password, event_password_hash
            ):
                conn.close()
                return jsonify(
                    {"error": "Incorrect event password", "requires_password": True}
                ), 403

        # Check if already registered
        existing = c.execute(
            "SELECT * FROM registrations WHERE event_id = ? AND user_id = ?",
            (event_id, request.user_id),
        ).fetchone()

        if existing:
            conn.close()
            return jsonify({"error": "Already registered"}), 400

        # Get email from request (can be any email, not just school email)
        registration_email = data.get("email", request.user_email)
        if not registration_email:
            conn.close()
            return jsonify({"error": "Email is required"}), 400

        # Register user (use provided email, not just authenticated user email)
        c.execute(
            "INSERT INTO registrations (event_id, user_id, user_email) VALUES (?, ?, ?)",
            (event_id, request.user_id, registration_email),
        )

        conn.commit()

        # Get updated registration count
        count = c.execute(
            "SELECT COUNT(*) as count FROM registrations WHERE event_id = ?",
            (event_id,),
        ).fetchone()

        conn.close()

        return jsonify(
            {
                "message": "Registered successfully",
                "count": count["count"],
                "congratulations": True,
            }
        ), 201

    except Exception as e:
        import traceback

        print(f"Error registering for event: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/api/events/<int:event_id>/mark-registered", methods=["POST"])
@require_auth
def mark_event_registered(event_id):
    """Mark event as registered (for external registrations) - just increases count"""
    try:
        conn = get_db()
        c = conn.cursor()

        # Check if event exists
        event = c.execute("SELECT id FROM events WHERE id = ?", (event_id,)).fetchone()
        if not event:
            conn.close()
            return jsonify({"error": "Event not found"}), 404

        # Check if already registered
        existing = c.execute(
            "SELECT * FROM registrations WHERE event_id = ? AND user_id = ?",
            (event_id, request.user_id),
        ).fetchone()

        if existing:
            conn.close()
            return jsonify({"error": "Already registered"}), 400

        # Register with a placeholder email (external registration)
        c.execute(
            "INSERT INTO registrations (event_id, user_id, user_email) VALUES (?, ?, ?)",
            (event_id, request.user_id, f"external_{request.user_email}"),
        )

        conn.commit()

        # Get updated registration count
        count = c.execute(
            "SELECT COUNT(*) as count FROM registrations WHERE event_id = ?",
            (event_id,),
        ).fetchone()

        conn.close()

        return jsonify(
            {"message": "Marked as registered", "count": count["count"]}
        ), 201

    except Exception as e:
        import traceback

        print(f"Error marking as registered: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/api/events/<int:event_id>/registrations", methods=["GET"])
def get_registrations(event_id):
    conn = get_db()
    c = conn.cursor()
    count = c.execute(
        "SELECT COUNT(*) as count FROM registrations WHERE event_id = ?", (event_id,)
    ).fetchone()
    conn.close()
    return jsonify({"count": count["count"]})


@app.route("/api/users/<int:user_id>/events", methods=["GET"])
@require_auth
def get_user_events(user_id):
    """Get all events a user has registered for"""
    try:
        # Only allow users to see their own events, or admins to see any user's events
        if user_id != request.user_id and request.user_role not in [
            "admin",
            "faculty",
            "ksac_member",
        ]:
            return jsonify({"error": "Unauthorized"}), 403

        conn = get_db()
        c = conn.cursor()

        # Get user's registered events with event details
        events = c.execute(
            """SELECT e.id, e.title, e.description, e.category, e.date, e.time, 
                             e.venue, e.poster_url, e.registration_url, e.society, e.created_at,
                             r.registered_at, r.user_email
                             FROM registrations r
                             JOIN events e ON r.event_id = e.id
                             WHERE r.user_id = ?
                             ORDER BY e.date DESC, e.time DESC""",
            (user_id,),
        ).fetchall()

        # Separate into upcoming and past events
        from datetime import datetime

        now = datetime.now()
        upcoming = []
        past = []

        for event in events:
            event_dict = dict(event)
            try:
                event_date = datetime.strptime(
                    f"{event_dict['date']} {event_dict['time']}", "%Y-%m-%d %H:%M:%S"
                )
                if event_date >= now:
                    upcoming.append(event_dict)
                else:
                    past.append(event_dict)
            except:
                # If date parsing fails, assume it's upcoming
                upcoming.append(event_dict)

        conn.close()

        return jsonify(
            {"upcoming": upcoming, "past": past, "total": len(upcoming) + len(past)}
        ), 200

    except Exception as e:
        import traceback

        print(f"Error fetching user events: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/api/users/<int:user_id>/profile", methods=["GET"])
@require_auth
def get_user_profile(user_id):
    """Get user profile information"""
    try:
        # Only allow users to see their own profile, or admins to see any profile
        if user_id != request.user_id and request.user_role not in [
            "admin",
            "faculty",
            "ksac_member",
        ]:
            return jsonify({"error": "Unauthorized"}), 403

        conn = get_db()
        c = conn.cursor()

        # Get user info
        user = c.execute(
            "SELECT id, email, name, role, society_name, created_at FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()

        if not user:
            conn.close()
            return jsonify({"error": "User not found"}), 404

        user_dict = dict(user)

        # Get registration stats
        total_registrations = c.execute(
            "SELECT COUNT(*) as count FROM registrations WHERE user_id = ?", (user_id,)
        ).fetchone()["count"]

        upcoming_count = c.execute(
            """SELECT COUNT(*) as count 
                                      FROM registrations r
                                      JOIN events e ON r.event_id = e.id
                                      WHERE r.user_id = ? AND e.date >= date('now')""",
            (user_id,),
        ).fetchone()["count"]

        conn.close()

        return jsonify(
            {
                "user": user_dict,
                "stats": {
                    "total_registrations": total_registrations,
                    "upcoming_events": upcoming_count,
                    "past_events": total_registrations - upcoming_count,
                },
            }
        ), 200

    except Exception as e:
        import traceback

        print(f"Error fetching user profile: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/api/stats", methods=["GET"])
def get_stats():
    try:
        conn = get_db()
        c = conn.cursor()

        total_events = c.execute("SELECT COUNT(*) as count FROM events").fetchone()[
            "count"
        ]
        total_registrations = c.execute(
            "SELECT COUNT(*) as count FROM registrations"
        ).fetchone()["count"]

        category_stats = c.execute("""SELECT category, COUNT(*) as count 
                                       FROM events GROUP BY category""").fetchall()

        conn.close()

        return jsonify(
            {
                "total_events": total_events,
                "total_registrations": total_registrations,
                "category_stats": {
                    row["category"]: row["count"] for row in category_stats
                },
            }
        )
    except Exception as e:
        print(f"Error getting stats: {str(e)}")
        return jsonify(
            {"total_events": 0, "total_registrations": 0, "category_stats": {}}
        )


# Authentication endpoints
@app.route("/api/auth/register", methods=["POST"])
def register():
    try:
        data = request.json

        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password required"}), 400

        email = data["email"].lower().strip()
        password = data["password"]
        name = data.get("name", "").strip()
        role = data.get("role", "student")
        secret_key = data.get("secret_key", "")
        society_name = data.get("society_name", "").strip()

        # Validate school email
        if not validate_school_email(email):
            return jsonify(
                {
                    "error": f"Only school email addresses are allowed. Allowed domains: {', '.join(SCHOOL_EMAIL_DOMAINS)}"
                }
            ), 400

        # Validate password strength
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        # Validate privileged roles with secret keys
        if role != "student":
            secret_keys = {
                "faculty": FACULTY_SECRET_KEY,
                "ksac_member": KSAC_SECRET_KEY,
                "society_president": SOCIETY_PRESIDENT_SECRET_KEY,
                "admin": ADMIN_SECRET_KEY,
            }

            if role not in secret_keys:
                return jsonify({"error": "Invalid role"}), 400

            if secret_key != secret_keys[role]:
                return jsonify({"error": "Invalid secret key for this role"}), 403

            if role == "society_president" and not society_name:
                return jsonify(
                    {"error": "Society name required for society president"}
                ), 400

        conn = get_db()
        c = conn.cursor()

        # Check if user exists
        existing = c.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            return jsonify({"error": "Email already registered"}), 400

        # Create user
        password_hash = hash_password(password)
        c.execute(
            "INSERT INTO users (email, password_hash, name, role, society_name) VALUES (?, ?, ?, ?, ?)",
            (
                email,
                password_hash,
                name,
                role,
                society_name if role == "society_president" else None,
            ),
        )

        conn.commit()
        user_id = c.lastrowid
        conn.close()

        # Generate token
        token = generate_token(user_id, email, role)

        return jsonify(
            {
                "message": "Registration successful",
                "token": token,
                "user": {
                    "id": user_id,
                    "email": email,
                    "name": name,
                    "role": role,
                    "society_name": society_name
                    if role == "society_president"
                    else None,
                },
            }
        ), 201

    except Exception as e:
        print(f"Error registering: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    try:
        data = request.json

        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password required"}), 400

        email = data["email"].lower().strip()
        password = data["password"]

        conn = get_db()
        c = conn.cursor()

        user = c.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        conn.close()

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if not verify_password(password, user["password_hash"]):
            return jsonify({"error": "Invalid email or password"}), 401

        # Convert Row to dict and handle missing role/society_name
        user_dict = dict(user)
        user_role = (
            user_dict.get("role", "student") if user_dict.get("role") else "student"
        )
        user_society = (
            user_dict.get("society_name") if user_dict.get("society_name") else None
        )

        # Generate token with role
        token = generate_token(user["id"], user["email"], user_role)

        return jsonify(
            {
                "message": "Login successful",
                "token": token,
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "name": user["name"],
                    "role": user_role,
                    "society_name": user_society,
                },
            }
        ), 200

    except Exception as e:
        print(f"Error logging in: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/me", methods=["GET"])
@require_auth
def get_current_user():
    try:
        conn = get_db()
        c = conn.cursor()
        user = c.execute(
            "SELECT id, email, name, role, society_name, created_at FROM users WHERE id = ?",
            (request.user_id,),
        ).fetchone()
        conn.close()

        if user:
            return jsonify(dict(user)), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/events/<int:event_id>/verify-password", methods=["POST"])
def verify_event_password(event_id):
    """Verify event password without registering"""
    try:
        data = request.json
        password = data.get("password", "")

        conn = get_db()
        c = conn.cursor()
        event = c.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
        conn.close()

        if not event:
            return jsonify({"error": "Event not found"}), 404

        if not event["is_locked"]:
            return jsonify({"valid": True, "message": "Event is not locked"}), 200

        if verify_password(password, event["event_password_hash"]):
            return jsonify({"valid": True, "message": "Password correct"}), 200
        else:
            return jsonify({"valid": False, "error": "Incorrect password"}), 403

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# AI Assistant endpoints
@app.route("/api/assistant/request", methods=["POST"])
def submit_event_request():
    """Submit event request to AI assistant (open to everyone)"""
    try:
        data = request.json
        request_text = data.get("request", "").strip()

        if not request_text:
            return jsonify({"error": "Request text is required"}), 400

        # Get user info if authenticated, otherwise anonymous
        user_id = None
        user_email = "anonymous"

        # Try to get auth token if present
        token = request.headers.get("Authorization")
        if token and token.startswith("Bearer "):
            token = token[7:]
            payload = verify_token(token)
            if payload:
                user_id = payload["user_id"]
                user_email = payload["email"]

        # Process request with ML assistant
        analysis = assistant.process_request(request_text)

        # Save to database
        conn = get_db()
        c = conn.cursor()

        # Check if society_name column exists
        c.execute("PRAGMA table_info(event_requests)")
        columns = [row[1] for row in c.fetchall()]
        has_society_name = "society_name" in columns

        if has_society_name:
            c.execute(
                """INSERT INTO event_requests 
                         (user_id, user_email, request_text, category_detected, sentiment, auto_response, status, society_name)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    user_id,
                    user_email,
                    request_text,
                    analysis["category"],
                    analysis["sentiment"],
                    analysis["auto_response"],
                    "pending",
                    analysis.get("society_name"),
                ),
            )
        else:
            # Fallback if column doesn't exist
            c.execute(
                """INSERT INTO event_requests 
                         (user_id, user_email, request_text, category_detected, sentiment, auto_response, status)
                         VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (
                    user_id,
                    user_email,
                    request_text,
                    analysis["category"],
                    analysis["sentiment"],
                    analysis["auto_response"],
                    "pending",
                ),
            )

        conn.commit()
        request_id = c.lastrowid
        conn.close()

        return jsonify(
            {
                "id": request_id,
                "request": request_text,
                "category": analysis["category"],
                "sentiment": analysis["sentiment"],
                "auto_response": analysis["auto_response"],
                "society_name": analysis.get("society_name"),
                "message": "Request submitted successfully",
            }
        ), 201

    except Exception as e:
        import traceback

        error_details = traceback.format_exc()
        print(f"Error processing request: {str(e)}")
        print(f"Traceback: {error_details}")
        return jsonify({"error": str(e), "details": error_details}), 500


@app.route("/api/assistant/requests", methods=["GET"])
@require_role("faculty", "ksac_member", "society_president", "admin")
def get_event_requests():
    """Get all event requests (for admins)"""
    try:
        status = request.args.get("status", "all")
        conn = get_db()
        c = conn.cursor()

        query = """SELECT er.*, u.name as user_name, 
                   admin.name as admin_name
                   FROM event_requests er
                   LEFT JOIN users u ON er.user_id = u.id
                   LEFT JOIN users admin ON er.admin_id = admin.id
                   WHERE 1=1"""
        params = []

        if status != "all":
            query += " AND er.status = ?"
            params.append(status)

        days = request.args.get("days", None)
        if days:
            query += " AND er.created_at >= datetime('now', '-' || ? || ' days')"
            params.append(days)

        query += " ORDER BY er.created_at DESC"

        requests = c.execute(query, params).fetchall()
        conn.close()

        return jsonify([dict(req) for req in requests]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/assistant/requests/<int:request_id>/respond", methods=["POST"])
@require_role("faculty", "ksac_member", "society_president", "admin")
def respond_to_request(request_id):
    """Admin responds to an event request"""
    try:
        data = request.json
        admin_response = data.get("response", "").strip()
        status = data.get("status", "responded")

        if not admin_response:
            return jsonify({"error": "Response text is required"}), 400

        conn = get_db()
        c = conn.cursor()

        # Update request
        c.execute(
            """UPDATE event_requests 
                     SET admin_response = ?, admin_id = ?, status = ?, responded_at = CURRENT_TIMESTAMP
                     WHERE id = ?""",
            (admin_response, request.user_id, status, request_id),
        )

        conn.commit()
        conn.close()

        return jsonify({"message": "Response submitted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/assistant/requests/<int:request_id>", methods=["GET"])
@require_auth
def get_request(request_id):
    """Get single event request"""
    try:
        conn = get_db()
        c = conn.cursor()
        req = c.execute(
            """SELECT er.*, u.name as user_name 
                          FROM event_requests er
                          LEFT JOIN users u ON er.user_id = u.id
                          WHERE er.id = ?""",
            (request_id,),
        ).fetchone()
        conn.close()

        if req:
            return jsonify(dict(req)), 200
        return jsonify({"error": "Request not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/assistant/requests/recent", methods=["GET"])
def get_recent_requests():
    """Get recent event requests from the last 20 days (public endpoint)"""
    try:
        conn = get_db()
        c = conn.cursor()

        # Get requests from the last 20 days
        requests = c.execute("""SELECT er.*, u.name as user_name
                               FROM event_requests er
                               LEFT JOIN users u ON er.user_id = u.id
                               WHERE er.created_at >= datetime('now', '-20 days')
                               ORDER BY er.created_at DESC
                               LIMIT 50""").fetchall()

        conn.close()

        return jsonify([dict(req) for req in requests]), 200

    except Exception as e:
        print(f"Error fetching recent requests: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/assistant/stats", methods=["GET"])
@require_role("faculty", "ksac_member", "society_president", "admin")
def get_assistant_stats():
    """Get statistics about event requests"""
    try:
        conn = get_db()
        c = conn.cursor()

        total_requests = c.execute(
            "SELECT COUNT(*) as count FROM event_requests"
        ).fetchone()["count"]
        pending_requests = c.execute(
            "SELECT COUNT(*) as count FROM event_requests WHERE status = 'pending'"
        ).fetchone()["count"]

        category_stats = c.execute("""SELECT category_detected, COUNT(*) as count 
                                     FROM event_requests 
                                     GROUP BY category_detected""").fetchall()

        sentiment_stats = c.execute("""SELECT sentiment, COUNT(*) as count 
                                       FROM event_requests 
                                       GROUP BY sentiment""").fetchall()

        conn.close()

        return jsonify(
            {
                "total_requests": total_requests,
                "pending_requests": pending_requests,
                "category_stats": {
                    row["category_detected"]: row["count"] for row in category_stats
                },
                "sentiment_stats": {
                    row["sentiment"]: row["count"] for row in sentiment_stats
                },
            }
        ), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ML Recommendation endpoints
@app.route("/api/ml/recommendations", methods=["GET"])
@require_auth
def get_recommendations():
    """Get ML-powered event recommendations for user"""
    try:
        recommendations = recommender.recommend_events(request.user_id, limit=5)
        return jsonify(
            {
                "recommendations": recommendations,
                "message": "Personalized recommendations based on your interests",
            }
        ), 200
    except Exception as e:
        print(f"Error getting recommendations: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/ml/predict-popularity", methods=["POST"])
@require_auth
def predict_event_popularity():
    """Predict event popularity using ML"""
    try:
        data = request.json
        prediction = recommender.predict_popularity(data)
        return jsonify(prediction), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/ml/trending", methods=["GET"])
def get_trending_categories():
    """Get trending event categories (public endpoint)"""
    try:
        days = request.args.get("days", 30)
        trending = recommender.get_trending_categories(int(days))
        return jsonify({"trending": trending, "period_days": int(days)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Semantic Search endpoint
@app.route("/api/ml/search", methods=["GET"])
def semantic_search_events():
    """Semantic search for events"""
    try:
        query = request.args.get("q", "")
        limit = int(request.args.get("limit", 10))
        category = request.args.get("category", None)
        date_filter = request.args.get("date", None)

        if not query:
            return jsonify({"error": "Search query required"}), 400

        results = semantic_search.search(query, limit, category, date_filter)
        return jsonify({"results": results, "query": query, "count": len(results)}), 200
    except Exception as e:
        import traceback

        print(f"Error in semantic search: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


# Description Enhancement endpoint
@app.route("/api/ml/enhance-description", methods=["POST"])
@require_auth
def enhance_description():
    """Analyze and enhance event description"""
    try:
        data = request.json
        description = data.get("description", "")
        title = data.get("title", "")
        category = data.get("category", "")
        date = data.get("date", "")
        venue = data.get("venue", "")

        analysis = description_enhancer.analyze_description(
            description, title, category, date, venue
        )

        return jsonify(analysis), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Event Success Prediction endpoint
@app.route("/api/ml/predict-success", methods=["POST"])
@require_auth
def predict_event_success():
    """Predict event success score"""
    try:
        data = request.json

        # Get description analysis if description provided
        description_analysis = None
        if data.get("description"):
            description_analysis = description_enhancer.analyze_description(
                data.get("description", ""),
                data.get("title", ""),
                data.get("category", ""),
                data.get("date", ""),
                data.get("venue", ""),
            )

        # Predict success
        prediction = success_predictor.predict_success(data, description_analysis)

        return jsonify(prediction), 200
    except Exception as e:
        import traceback

        print(f"Error predicting success: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


# Banned Words Management endpoints (Admin only)
@app.route("/api/admin/banned-words", methods=["GET"])
@require_role("admin", "faculty", "ksac_member")
def get_banned_words():
    """Get all banned words (admin only)"""
    try:
        conn = get_db()
        c = conn.cursor()
        words = c.execute("""SELECT bw.id, bw.word, bw.reason, bw.created_at, 
                           u.email as added_by_email
                           FROM banned_words bw
                           LEFT JOIN users u ON bw.added_by = u.id
                           ORDER BY bw.created_at DESC""").fetchall()
        conn.close()

        return jsonify([dict(word) for word in words]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/admin/banned-words", methods=["POST"])
@require_role("admin", "faculty", "ksac_member")
def add_banned_word():
    """Add a banned word (admin only)"""
    try:
        data = request.json
        word = data.get("word", "").strip().lower()
        reason = data.get("reason", "").strip()

        if not word:
            return jsonify({"error": "Word is required"}), 400

        conn = get_db()
        c = conn.cursor()

        # Check if word already exists
        existing = c.execute(
            "SELECT id FROM banned_words WHERE word = ?", (word,)
        ).fetchone()
        if existing:
            conn.close()
            return jsonify({"error": "Word already banned"}), 400

        # Add the word
        c.execute(
            "INSERT INTO banned_words (word, reason, added_by) VALUES (?, ?, ?)",
            (word, reason, request.user_id),
        )

        conn.commit()
        word_id = c.lastrowid
        conn.close()

        return jsonify(
            {"id": word_id, "word": word, "message": "Banned word added successfully"}
        ), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/admin/banned-words/<int:word_id>", methods=["DELETE"])
@require_role("admin", "faculty", "ksac_member")
def remove_banned_word(word_id):
    """Remove a banned word (admin only)"""
    try:
        conn = get_db()
        c = conn.cursor()

        # Check if word exists
        word = c.execute(
            "SELECT word FROM banned_words WHERE id = ?", (word_id,)
        ).fetchone()
        if not word:
            conn.close()
            return jsonify({"error": "Banned word not found"}), 404

        # Delete the word
        c.execute("DELETE FROM banned_words WHERE id = ?", (word_id,))
        conn.commit()
        conn.close()

        return jsonify(
            {"message": "Banned word removed successfully", "word": dict(word)["word"]}
        ), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Health check endpoint for Render
@app.route("/health", methods=["GET"])
def health_check():
    try:
        # Test database connection
        conn = get_db()
        conn.close()
        return jsonify(
            {
                "status": "healthy",
                "database": "connected",
                "timestamp": datetime.now().isoformat(),
            }
        ), 200
    except Exception as e:
        return jsonify(
            {
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
            }
        ), 503


# Initialize database on startup
init_db()


# Serve React SPA - catch-all route for frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    """Serve React app for all non-API routes"""
    if not app.static_folder:
        return (
            "Frontend build not found. Run the Vite dev server or build the frontend.",
            404,
        )
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return app.send_static_file(path)
    else:
        return app.send_static_file("index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Events Navigator Backend starting on port {port}")
    print("📦 Database initialized: events.db")
    app.run(host="0.0.0.0", port=port, debug=False)
