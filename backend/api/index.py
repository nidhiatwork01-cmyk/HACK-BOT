"""
Vercel Serverless Function wrapper for Flask app
This file is required for Vercel to run the Flask backend
"""
try:
    # When imported as a package (repo root on PYTHONPATH)
    from backend.app import app
except ImportError:  # Fallback for running from `backend/` directly
    from app import app

# This is the WSGI application that Vercel will call
application = app

# For local development
if __name__ == "__main__":
    app.run(debug=True)
