"""
Event Success Score Predictor
Predicts overall event success before it happens
"""
from datetime import datetime
import math

class SuccessPredictor:
    def __init__(self):
        # Feature weights (learned from patterns)
        self.weights = {
            'category_popularity': 0.25,
            'timing_score': 0.20,
            'description_quality': 0.20,
            'organizer_reputation': 0.15,
            'venue_quality': 0.10,
            'event_type': 0.10
        }
        
        # Category popularity scores (based on historical data)
        self.category_scores = {
            'technical': 0.85,
            'cultural': 0.80,
            'sports': 0.75,
            'academic': 0.70,
            'general': 0.65
        }
        
        # Event type scores
        self.event_type_scores = {
            'hackathon': 0.90,
            'workshop': 0.85,
            'seminar': 0.80,
            'competition': 0.85,
            'festival': 0.85,
            'conference': 0.75,
            'lecture': 0.70,
            'meetup': 0.75
        }
    
    def predict_success(self, event_data, description_analysis=None):
        """
        Predict event success score (0-100)
        
        Args:
            event_data: Dict with event details
            description_analysis: Optional description quality analysis
        """
        scores = {}
        
        # 1. Category Popularity Score
        category = event_data.get('category', 'general').lower()
        scores['category'] = self.category_scores.get(category, 0.65)
        
        # 2. Timing Score
        scores['timing'] = self._calculate_timing_score(
            event_data.get('date'),
            event_data.get('time')
        )
        
        # 3. Description Quality Score
        if description_analysis:
            scores['description'] = description_analysis.get('score', 50) / 100.0
        else:
            desc = event_data.get('description', '')
            scores['description'] = min(len(desc) / 200.0, 1.0) if desc else 0.3
        
        # 4. Organizer Reputation Score
        society = event_data.get('society', '')
        scores['organizer'] = self._calculate_organizer_score(society)
        
        # 5. Venue Quality Score
        venue = event_data.get('venue', '')
        scores['venue'] = self._calculate_venue_score(venue)
        
        # 6. Event Type Score
        event_type = self._detect_event_type(
            event_data.get('title', ''),
            event_data.get('description', '')
        )
        scores['event_type'] = self.event_type_scores.get(event_type, 0.75)
        
        # Calculate weighted success score
        success_score = (
            scores['category'] * self.weights['category_popularity'] +
            scores['timing'] * self.weights['timing_score'] +
            scores['description'] * self.weights['description_quality'] +
            scores['organizer'] * self.weights['organizer_reputation'] +
            scores['venue'] * self.weights['venue_quality'] +
            scores['event_type'] * self.weights['event_type']
        )
        
        # Convert to 0-100 scale
        success_score = success_score * 100
        
        # Predict registration count
        predicted_registrations = self._predict_registrations(success_score, category)
        
        # Determine success level
        if success_score >= 85:
            level = 'Excellent'
            color = 'green'
        elif success_score >= 75:
            level = 'Very Good'
            color = 'blue'
        elif success_score >= 65:
            level = 'Good'
            color = 'yellow'
        elif success_score >= 55:
            level = 'Fair'
            color = 'orange'
        else:
            level = 'Needs Improvement'
            color = 'red'
        
        return {
            'success_score': round(success_score, 1),
            'level': level,
            'color': color,
            'predicted_registrations': predicted_registrations,
            'component_scores': {
                'category': round(scores['category'] * 100, 1),
                'timing': round(scores['timing'] * 100, 1),
                'description': round(scores['description'] * 100, 1),
                'organizer': round(scores['organizer'] * 100, 1),
                'venue': round(scores['venue'] * 100, 1),
                'event_type': round(scores['event_type'] * 100, 1)
            },
            'recommendations': self._generate_recommendations(scores, success_score)
        }
    
    def _calculate_timing_score(self, date_str, time_str):
        """Calculate timing score based on date and time"""
        try:
            if not date_str:
                return 0.5
            
            event_date = datetime.strptime(date_str, '%Y-%m-%d')
            now = datetime.now()
            days_away = (event_date - now).days
            
            # Day of week (0=Monday, 6=Sunday)
            day_of_week = event_date.weekday()
            
            score = 0.5  # Base score
            
            # Weekend bonus
            if day_of_week >= 5:  # Saturday or Sunday
                score += 0.2
            elif day_of_week == 4:  # Friday
                score += 0.1
            
            # Timing bonus (not too far, not too close)
            if 7 <= days_away <= 30:
                score += 0.2  # Sweet spot: 1 week to 1 month away
            elif 3 <= days_away < 7:
                score += 0.1  # Short notice but still okay
            elif days_away < 3:
                score -= 0.1  # Too soon
            elif days_away > 60:
                score -= 0.1  # Too far away
            
            # Time of day (if provided)
            if time_str:
                try:
                    hour = int(time_str.split(':')[0])
                    if 10 <= hour <= 18:  # Good hours (10 AM to 6 PM)
                        score += 0.1
                    elif hour < 9 or hour > 20:
                        score -= 0.1  # Too early or too late
                except:
                    pass
            
            return max(0.0, min(1.0, score))
        except:
            return 0.5
    
    def _calculate_organizer_score(self, society):
        """Calculate organizer reputation score"""
        if not society:
            return 0.6
        
        society_lower = society.lower()
        
        # Known popular societies/clubs get higher scores
        popular_societies = [
            'coding', 'tech', 'technical', 'cs', 'computer',
            'cultural', 'dance', 'music', 'drama',
            'sports', 'cricket', 'football'
        ]
        
        for popular in popular_societies:
            if popular in society_lower:
                return 0.8
        
        # If society name exists, give base score
        if len(society) > 3:
            return 0.7
        
        return 0.6
    
    def _calculate_venue_score(self, venue):
        """Calculate venue quality score"""
        if not venue:
            return 0.5
        
        venue_lower = venue.lower()
        
        # Good venues
        good_venues = ['auditorium', 'hall', 'stadium', 'ground', 'center', 'centre']
        if any(gv in venue_lower for gv in good_venues):
            return 0.8
        
        # If venue specified, give base score
        if len(venue) > 5:
            return 0.7
        
        return 0.5
    
    def _detect_event_type(self, title, description):
        """Detect event type from title and description"""
        text = f"{title} {description}".lower()
        
        type_keywords = {
            'hackathon': ['hackathon', 'hack', 'coding competition'],
            'workshop': ['workshop', 'hands-on', 'practical'],
            'seminar': ['seminar', 'talk', 'presentation'],
            'competition': ['competition', 'contest', 'tournament'],
            'festival': ['festival', 'fest', 'celebration'],
            'conference': ['conference', 'summit', 'convention'],
            'lecture': ['lecture', 'guest lecture', 'keynote'],
            'meetup': ['meetup', 'networking', 'social']
        }
        
        for event_type, keywords in type_keywords.items():
            if any(keyword in text for keyword in keywords):
                return event_type
        
        return 'general'
    
    def _predict_registrations(self, success_score, category):
        """Predict registration count based on success score"""
        # Base registrations by category
        base_registrations = {
            'technical': 50,
            'cultural': 80,
            'sports': 60,
            'academic': 40,
            'general': 30
        }
        
        base = base_registrations.get(category.lower(), 30)
        
        # Scale by success score
        multiplier = success_score / 70.0  # Normalize around 70
        predicted = int(base * multiplier)
        
        # Add some variance
        return max(10, predicted)
    
    def _generate_recommendations(self, scores, success_score):
        """Generate improvement recommendations"""
        recommendations = []
        
        if scores['timing'] < 0.6:
            recommendations.append("Consider scheduling on a weekend or Friday for better attendance")
        
        if scores['description'] < 0.7:
            recommendations.append("Improve event description with more details about what, when, where, and why")
        
        if scores['organizer'] < 0.7:
            recommendations.append("Mention the organizing society/club to build trust")
        
        if scores['venue'] < 0.7:
            recommendations.append("Specify a clear venue location")
        
        if success_score < 70:
            recommendations.append("Overall: Consider improving timing, description quality, or event type to increase success probability")
        
        return recommendations[:3]  # Top 3 recommendations

# Initialize predictor
success_predictor = SuccessPredictor()

