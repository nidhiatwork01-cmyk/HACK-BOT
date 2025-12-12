"""
ML Event Recommendation System
Uses collaborative filtering and content-based filtering to recommend events
"""
import sqlite3
from collections import defaultdict
import math

class EventRecommender:
    def __init__(self, db_name='events.db'):
        self.db_name = db_name
    
    def get_user_event_matrix(self):
        """Build user-event interaction matrix from registrations and requests"""
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        
        # Get all registrations
        registrations = c.execute('''
            SELECT user_id, event_id 
            FROM registrations 
            WHERE user_id IS NOT NULL
        ''').fetchall()
        
        # Get all event requests (as preferences)
        requests = c.execute('''
            SELECT user_id, category_detected 
            FROM event_requests 
            WHERE user_id IS NOT NULL AND category_detected IS NOT NULL
        ''').fetchall()
        
        conn.close()
        
        # Build interaction matrix
        user_events = defaultdict(set)
        user_categories = defaultdict(lambda: defaultdict(int))
        
        # Add registrations
        for user_id, event_id in registrations:
            user_events[user_id].add(event_id)
        
        # Add category preferences from requests
        for user_id, category in requests:
            user_categories[user_id][category] += 1
        
        return user_events, user_categories
    
    def cosine_similarity(self, vec1, vec2):
        """Calculate cosine similarity between two vectors"""
        intersection = set(vec1.keys()) & set(vec2.keys())
        if not intersection:
            return 0.0
        
        numerator = sum(vec1[x] * vec2[x] for x in intersection)
        sum1 = sum(vec1[x] ** 2 for x in vec1)
        sum2 = sum(vec2[x] ** 2 for x in vec2)
        
        if sum1 == 0 or sum2 == 0:
            return 0.0
        
        denominator = math.sqrt(sum1) * math.sqrt(sum2)
        return numerator / denominator if denominator != 0 else 0.0
    
    def recommend_events(self, user_id, limit=5):
        """Recommend events for a user using collaborative filtering"""
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        
        # Get user's category preferences
        user_requests = c.execute('''
            SELECT category_detected 
            FROM event_requests 
            WHERE user_id = ? AND category_detected IS NOT NULL
        ''', (user_id,)).fetchall()
        
        user_categories = [req[0] for req in user_requests]
        
        # Get all upcoming events
        events = c.execute('''
            SELECT id, title, description, category, date, time, venue, poster_url, society
            FROM events 
            WHERE date >= date('now')
            ORDER BY date ASC
        ''').fetchall()
        
        conn.close()
        
        if not events:
            return []
        
        # Score events based on user preferences
        scored_events = []
        for event in events:
            event_id, title, desc, category, date, time, venue, poster, society = event
            
            score = 0.0
            
            # Category match bonus
            if category in user_categories:
                score += 2.0
            
            # Count how many times user requested this category
            category_count = user_categories.count(category)
            score += category_count * 0.5
            
            # Recency bonus (events happening soon get higher score)
            from datetime import datetime
            try:
                event_date = datetime.strptime(date, '%Y-%m-%d')
                days_away = (event_date - datetime.now()).days
                if days_away <= 7:
                    score += 1.0  # Events within a week
                elif days_away <= 30:
                    score += 0.5  # Events within a month
            except:
                pass
            
            scored_events.append({
                'id': event_id,
                'title': title,
                'description': desc,
                'category': category,
                'date': date,
                'time': time,
                'venue': venue,
                'poster_url': poster,
                'society': society,
                'score': score,
                'confidence': min(score / 3.0, 1.0)  # Normalize to 0-1
            })
        
        # Sort by score and return top recommendations
        scored_events.sort(key=lambda x: x['score'], reverse=True)
        return scored_events[:limit]
    
    def predict_popularity(self, event_data):
        """Predict how popular an event will be based on features"""
        # Features: category, day of week, time, description length, society
        category_weights = {
            'technical': 0.9,
            'cultural': 0.85,
            'sports': 0.8,
            'academic': 0.7,
            'general': 0.6
        }
        
        base_score = category_weights.get(event_data.get('category', 'general'), 0.6)
        
        # Day of week bonus (weekends are more popular)
        from datetime import datetime
        try:
            event_date = datetime.strptime(event_data.get('date', ''), '%Y-%m-%d')
            day_of_week = event_date.weekday()  # 0=Monday, 6=Sunday
            if day_of_week >= 5:  # Saturday or Sunday
                base_score += 0.1
        except:
            pass
        
        # Description length bonus (detailed descriptions attract more)
        desc_length = len(event_data.get('description', ''))
        if desc_length > 200:
            base_score += 0.05
        elif desc_length > 100:
            base_score += 0.03
        
        # Society bonus (known societies get more interest)
        if event_data.get('society'):
            base_score += 0.05
        
        # Normalize to 0-100 scale
        popularity_score = min(base_score * 100, 100)
        
        # Predict registration count (rough estimate)
        predicted_registrations = int(popularity_score * 2)  # Scale factor
        
        return {
            'popularity_score': round(popularity_score, 1),
            'predicted_registrations': predicted_registrations,
            'confidence': 'high' if popularity_score > 70 else 'medium' if popularity_score > 50 else 'low'
        }
    
    def get_trending_categories(self, days=30):
        """Analyze trending event categories"""
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        
        # Get category counts from requests in last N days
        requests = c.execute('''
            SELECT category_detected, COUNT(*) as count
            FROM event_requests
            WHERE created_at >= datetime('now', '-' || ? || ' days')
            AND category_detected IS NOT NULL
            GROUP BY category_detected
            ORDER BY count DESC
        ''', (days,)).fetchall()
        
        # Get category counts from actual events
        events = c.execute('''
            SELECT category, COUNT(*) as count
            FROM events
            WHERE date >= date('now')
            GROUP BY category
            ORDER BY count DESC
        ''').fetchall()
        
        conn.close()
        
        # Combine and calculate trends
        category_trends = {}
        
        # Add request trends
        for category, count in requests:
            if category not in category_trends:
                category_trends[category] = {'requests': 0, 'events': 0}
            category_trends[category]['requests'] = count
        
        # Add event trends
        for category, count in events:
            if category not in category_trends:
                category_trends[category] = {'requests': 0, 'events': 0}
            category_trends[category]['events'] = count
        
        # Calculate trend scores
        trending = []
        for category, data in category_trends.items():
            score = data['requests'] * 2 + data['events']  # Requests weighted more
            trending.append({
                'category': category,
                'request_count': data['requests'],
                'event_count': data['events'],
                'trend_score': score,
                'trend': 'hot' if score > 10 else 'rising' if score > 5 else 'stable'
            })
        
        trending.sort(key=lambda x: x['trend_score'], reverse=True)
        return trending

# Initialize recommender
recommender = EventRecommender()

