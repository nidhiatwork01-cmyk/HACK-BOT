"""
Event Description Enhancement using NLP
Analyzes event descriptions and suggests improvements
"""
import re
from collections import Counter

class DescriptionEnhancer:
    def __init__(self):
        # Quality indicators
        self.min_length = 50  # Minimum recommended length
        self.optimal_length = 150  # Optimal length
        self.max_length = 500  # Maximum before it's too long
        
        # Important elements to check
        self.important_elements = {
            'what': ['what', 'about', 'event', 'activity', 'workshop', 'seminar'],
            'when': ['when', 'date', 'time', 'schedule', 'duration'],
            'where': ['where', 'venue', 'location', 'place', 'address'],
            'who': ['who', 'organizer', 'society', 'club', 'committee', 'speaker'],
            'why': ['why', 'benefit', 'learn', 'gain', 'skill', 'opportunity']
        }
    
    def analyze_description(self, description, title=None, category=None, date=None, venue=None):
        """Analyze description quality and provide suggestions"""
        if not description:
            return {
                'score': 0,
                'grade': 'F',
                'suggestions': ['Add a description to help attendees understand your event'],
                'missing_elements': list(self.important_elements.keys()),
                'enhanced_description': None
            }
        
        desc_lower = description.lower()
        score = 100
        suggestions = []
        missing_elements = []
        strengths = []
        
        # Check length
        length = len(description)
        if length < self.min_length:
            score -= 30
            suggestions.append(f"Description is too short ({length} chars). Aim for at least {self.min_length} characters to provide enough information.")
        elif length < self.optimal_length:
            score -= 10
            suggestions.append(f"Description could be more detailed ({length} chars). Consider adding more information (aim for {self.optimal_length}+ characters).")
        elif length > self.max_length:
            score -= 15
            suggestions.append(f"Description is quite long ({length} chars). Consider making it more concise while keeping key information.")
        else:
            strengths.append(f"Good description length ({length} characters)")
        
        # Check for important elements
        found_elements = {}
        for element, keywords in self.important_elements.items():
            found = any(keyword in desc_lower for keyword in keywords)
            found_elements[element] = found
            
            if not found:
                missing_elements.append(element)
                if element == 'what':
                    score -= 20
                    suggestions.append("Mention what the event is about")
                elif element == 'when':
                    score -= 15
                    if not date:
                        suggestions.append("Include when the event takes place (date/time)")
                elif element == 'where':
                    score -= 15
                    if not venue:
                        suggestions.append("Mention where the event will be held (venue/location)")
                elif element == 'who':
                    score -= 10
                    suggestions.append("Include who is organizing or speaking at the event")
                elif element == 'why':
                    score -= 10
                    suggestions.append("Explain why attendees should come (benefits, learning outcomes)")
            else:
                strengths.append(f"Good: Includes {element} information")
        
        # Check for engagement words
        engagement_words = ['join', 'participate', 'learn', 'explore', 'discover', 'experience', 'connect', 'network']
        has_engagement = any(word in desc_lower for word in engagement_words)
        if not has_engagement:
            score -= 5
            suggestions.append("Add engaging action words (e.g., 'join', 'learn', 'explore') to encourage participation")
        else:
            strengths.append("Includes engaging language")
        
        # Check for contact/registration info
        if 'register' not in desc_lower and 'registration' not in desc_lower:
            score -= 5
            suggestions.append("Mention how to register or get more information")
        
        # Check readability (sentence count)
        sentences = re.split(r'[.!?]+', description)
        sentence_count = len([s for s in sentences if s.strip()])
        if sentence_count < 2:
            score -= 10
            suggestions.append("Break description into multiple sentences for better readability")
        elif sentence_count > 8:
            score -= 5
            suggestions.append("Consider breaking long description into shorter paragraphs")
        
        # Calculate grade
        if score >= 90:
            grade = 'A'
        elif score >= 80:
            grade = 'B'
        elif score >= 70:
            grade = 'C'
        elif score >= 60:
            grade = 'D'
        else:
            grade = 'F'
        
        # Generate enhanced description suggestion
        enhanced = self._generate_enhanced_description(description, title, category, date, venue, missing_elements)
        
        return {
            'score': max(0, min(100, score)),
            'grade': grade,
            'suggestions': suggestions[:5],  # Top 5 suggestions
            'strengths': strengths,
            'missing_elements': missing_elements,
            'enhanced_description': enhanced,
            'length': length,
            'sentence_count': sentence_count
        }
    
    def _generate_enhanced_description(self, current_desc, title, category, date, venue, missing_elements):
        """Generate an enhanced description suggestion"""
        if not current_desc:
            current_desc = ""
        
        enhanced_parts = []
        
        # Start with current description if it exists
        if current_desc:
            enhanced_parts.append(current_desc.strip())
        
        # Add missing elements
        additions = []
        
        if 'what' in missing_elements and title:
            additions.append(f"This {category or 'event'} is about {title.lower()}.")
        
        if 'when' in missing_elements and date:
            additions.append(f"The event will take place on {date}.")
        
        if 'where' in missing_elements and venue:
            additions.append(f"Location: {venue}.")
        
        if 'why' in missing_elements:
            additions.append("Don't miss this opportunity to learn, network, and grow!")
        
        if additions:
            enhanced_parts.append(" ".join(additions))
        
        # Add call to action if missing
        if 'register' not in current_desc.lower():
            enhanced_parts.append("Register now to secure your spot!")
        
        enhanced = " ".join(enhanced_parts)
        
        # Only return if it's meaningfully different
        if len(enhanced) > len(current_desc) * 1.2 or missing_elements:
            return enhanced[:500]  # Limit length
        
        return None

# Initialize enhancer
description_enhancer = DescriptionEnhancer()

