"""
Vercel Serverless Function wrapper for Flask app
This file is required for Vercel to run the Flask backend
"""
from app import app

# This is the WSGI application that Vercel will call
application = app

# For local development
if __name__ == "__main__":
    app.run(debug=True)
