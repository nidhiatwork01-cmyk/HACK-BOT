"""
Debug script to check user registration and login issues
Run this to see what users exist in the database
"""
import sqlite3
import sys

DB_NAME = 'events.db'

def check_users():
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        # Get all users
        users = c.execute('SELECT id, email, name, role, created_at FROM users').fetchall()
        
        print(f"\n{'='*60}")
        print(f"Total users in database: {len(users)}")
        print(f"{'='*60}\n")
        
        if len(users) == 0:
            print("❌ No users found in database!")
            print("\nPossible issues:")
            print("1. You registered on a different backend (local vs deployed)")
            print("2. Database file is different")
            print("3. Registration didn't complete successfully")
            return
        
        print("Registered users:")
        print("-" * 60)
        for user in users:
            print(f"ID: {user['id']}")
            print(f"Email: {user['email']}")
            print(f"Name: {user['name'] or 'N/A'}")
            print(f"Role: {user['role']}")
            print(f"Created: {user['created_at']}")
            print("-" * 60)
        
        # Check specific email
        if len(sys.argv) > 1:
            email = sys.argv[1].lower().strip()
            print(f"\n🔍 Checking for email: {email}")
            user = c.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
            if user:
                print(f"✅ User found!")
                print(f"   ID: {user['id']}")
                print(f"   Email: {user['email']}")
                print(f"   Name: {user['name']}")
                print(f"   Role: {user['role']}")
                print(f"   Has password hash: {'Yes' if user['password_hash'] else 'No'}")
            else:
                print(f"❌ User NOT found!")
                print(f"\nPossible reasons:")
                print(f"1. Email case mismatch (searched for: {email})")
                print(f"2. User registered on different backend")
                print(f"3. Database file is different")
        
        conn.close()
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    check_users()

