"""
Database Configuration for Azure Deployment
This module provides a flexible database connection handler that works with both
SQLite (local development) and PostgreSQL (Azure production).

Usage:
    1. Set DATABASE_URL environment variable for PostgreSQL
    2. If not set, falls back to SQLite for local development
    3. Import get_connection() and use instead of sqlite3.connect()
"""

import os
import sqlite3
from typing import Any, Optional
from contextlib import contextmanager

# Check if PostgreSQL is available
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    POSTGRES_AVAILABLE = True
except ImportError:
    POSTGRES_AVAILABLE = False
    print("⚠️  psycopg2 not installed. Install with: pip install psycopg2-binary")

# Database configuration
DATABASE_URL = os.environ.get('DATABASE_URL')
SQLITE_DB_PATH = os.path.join(os.path.dirname(__file__), 'events.db')
USE_POSTGRES = DATABASE_URL and POSTGRES_AVAILABLE


class DatabaseConnection:
    """Unified database connection handler for SQLite and PostgreSQL"""
    
    def __init__(self):
        self.use_postgres = USE_POSTGRES
        self.database_url = DATABASE_URL
        self.sqlite_path = SQLITE_DB_PATH
    
    def get_connection(self):
        """Get a database connection (PostgreSQL or SQLite)"""
        if self.use_postgres:
            conn = psycopg2.connect(self.database_url, cursor_factory=RealDictCursor)
            return conn
        else:
            conn = sqlite3.connect(self.sqlite_path)
            conn.row_factory = sqlite3.Row
            return conn
    
    @contextmanager
    def get_cursor(self):
        """Context manager for database operations"""
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            yield cursor
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
            conn.close()
    
    def execute_query(self, query: str, params: tuple = None, fetch: str = 'all'):
        """
        Execute a query and return results
        
        Args:
            query: SQL query string
            params: Query parameters (tuple)
            fetch: 'all', 'one', or None (for INSERT/UPDATE/DELETE)
        
        Returns:
            Query results or None
        """
        with self.get_cursor() as cursor:
            cursor.execute(query, params or ())
            
            if fetch == 'all':
                return cursor.fetchall()
            elif fetch == 'one':
                return cursor.fetchone()
            elif fetch == 'lastid':
                if self.use_postgres:
                    return cursor.fetchone()[0] if cursor.rowcount > 0 else None
                else:
                    return cursor.lastrowid
            else:
                return None
    
    def get_database_type(self) -> str:
        """Return the current database type"""
        return "PostgreSQL" if self.use_postgres else "SQLite"


# Global database instance
db = DatabaseConnection()


def get_connection():
    """
    Get a database connection (backward compatible)
    
    Returns:
        Connection object (psycopg2 or sqlite3)
    """
    return db.get_connection()


def migrate_to_postgres():
    """
    Helper function to migrate data from SQLite to PostgreSQL
    Run this once when switching to Azure with PostgreSQL
    """
    if not POSTGRES_AVAILABLE:
        print("❌ psycopg2 not installed. Install with: pip install psycopg2-binary")
        return
    
    if not DATABASE_URL:
        print("❌ DATABASE_URL environment variable not set")
        return
    
    print("🔄 Starting migration from SQLite to PostgreSQL...")
    
    # Connect to SQLite (source)
    sqlite_conn = sqlite3.connect(SQLITE_DB_PATH)
    sqlite_conn.row_factory = sqlite3.Row
    sqlite_cursor = sqlite_conn.cursor()
    
    # Connect to PostgreSQL (destination)
    pg_conn = psycopg2.connect(DATABASE_URL)
    pg_cursor = pg_conn.cursor()
    
    try:
        # Migrate users table
        print("📦 Migrating users...")
        sqlite_cursor.execute("SELECT * FROM users")
        users = sqlite_cursor.fetchall()
        
        for user in users:
            pg_cursor.execute("""
                INSERT INTO users (id, email, password_hash, name, role, society_name, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, tuple(user))
        
        print(f"✅ Migrated {len(users)} users")
        
        # Migrate events table
        print("📦 Migrating events...")
        sqlite_cursor.execute("SELECT * FROM events")
        events = sqlite_cursor.fetchall()
        
        for event in events:
            pg_cursor.execute("""
                INSERT INTO events (id, title, description, category, date, time, venue,
                                   poster_url, registration_url, society, created_by,
                                   event_password_hash, is_locked, is_expired, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, tuple(event))
        
        print(f"✅ Migrated {len(events)} events")
        
        # Migrate interests table
        print("📦 Migrating interests...")
        sqlite_cursor.execute("SELECT * FROM interests")
        interests = sqlite_cursor.fetchall()
        
        for interest in interests:
            pg_cursor.execute("""
                INSERT INTO interests (id, event_id, user_id)
                VALUES (%s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, tuple(interest))
        
        print(f"✅ Migrated {len(interests)} interests")
        
        # Migrate other tables as needed...
        
        pg_conn.commit()
        print("✅ Migration completed successfully!")
        
    except Exception as e:
        pg_conn.rollback()
        print(f"❌ Migration failed: {e}")
        raise
    
    finally:
        sqlite_cursor.close()
        sqlite_conn.close()
        pg_cursor.close()
        pg_conn.close()


def init_postgres_tables():
    """
    Initialize PostgreSQL tables with the correct schema
    Run this before migration or on first deployment
    """
    if not POSTGRES_AVAILABLE or not DATABASE_URL:
        print("❌ PostgreSQL not configured")
        return
    
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    try:
        print("🔧 Creating PostgreSQL tables...")
        
        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT,
                role TEXT DEFAULT 'student',
                society_name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Events table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                category TEXT NOT NULL,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                venue TEXT NOT NULL,
                poster_url TEXT,
                registration_url TEXT,
                society TEXT,
                created_by INTEGER REFERENCES users(id),
                event_password_hash TEXT,
                is_locked INTEGER DEFAULT 0,
                is_expired INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Interests table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS interests (
                id SERIAL PRIMARY KEY,
                event_id INTEGER REFERENCES events(id),
                user_id TEXT
            )
        """)
        
        # Registrations table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS registrations (
                id SERIAL PRIMARY KEY,
                event_id INTEGER REFERENCES events(id),
                user_id INTEGER REFERENCES users(id),
                registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Assistant requests table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS assistant_requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                request_text TEXT NOT NULL,
                response_text TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        print("✅ PostgreSQL tables created successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Table creation failed: {e}")
        raise
    
    finally:
        cursor.close()
        conn.close()


# Print database configuration on import
print(f"📊 Database: {db.get_database_type()}")
if USE_POSTGRES:
    print(f"🔗 PostgreSQL URL: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'configured'}")
else:
    print(f"📁 SQLite Path: {SQLITE_DB_PATH}")


# Example usage in main app.py:
"""
# Instead of:
conn = sqlite3.connect(DB_NAME)

# Use:
from db_config_azure import get_connection
conn = get_connection()

# Or use the helper methods:
from db_config_azure import db

# Execute a query
users = db.execute_query("SELECT * FROM users WHERE email = %s", (email,), fetch='all')

# Get last inserted ID
user_id = db.execute_query(
    "INSERT INTO users (email, password_hash) VALUES (%s, %s) RETURNING id",
    (email, password_hash),
    fetch='lastid'
)
"""


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "init":
            print("Initializing PostgreSQL tables...")
            init_postgres_tables()
        
        elif command == "migrate":
            print("Migrating data from SQLite to PostgreSQL...")
            migrate_to_postgres()
        
        elif command == "test":
            print(f"Current database: {db.get_database_type()}")
            print(f"PostgreSQL available: {POSTGRES_AVAILABLE}")
            print(f"DATABASE_URL set: {'Yes' if DATABASE_URL else 'No'}")
        
        else:
            print("Unknown command. Available commands: init, migrate, test")
    
    else:
        print("\nUsage:")
        print("  python db_config_azure.py init     - Initialize PostgreSQL tables")
        print("  python db_config_azure.py migrate  - Migrate data from SQLite to PostgreSQL")
        print("  python db_config_azure.py test     - Test database configuration")
