from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_journal_prompt(mood_label: str, mood_score: int, recent_notes: str = "") -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": "You are a compassionate mental health journaling assistant. Generate thoughtful, empathetic journaling prompts."
            }, {
                "role": "user",
                "content": f"User is feeling {mood_label} (score {mood_score}/10). Recent notes: {recent_notes}. Suggest a personalized journaling prompt."
            }],
            max_tokens=150
        )
        return response.choices[0].message.content
    except Exception:
        return "Take a moment to reflect: What is one thing you're grateful for today, and what challenged you?"

def suggest_coping_strategy(mood_label: str, mood_score: int) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": "You are a supportive mental health assistant. Suggest practical, evidence-based coping strategies. Be warm and concise."
            }, {
                "role": "user",
                "content": f"Someone is feeling {mood_label} with intensity {mood_score}/10. Suggest 3 brief coping strategies."
            }],
            max_tokens=200
        )
        return response.choices[0].message.content
    except Exception:
        return "1. Take 5 deep breaths\n2. Go for a short walk\n3. Write down your thoughts"

def summarize_journal(content: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": "Summarize journal entries in 1-2 empathetic sentences, highlighting key emotions and themes."
            }, {
                "role": "user",
                "content": f"Summarize this journal entry: {content[:1000]}"
            }],
            max_tokens=100
        )
        return response.choices[0].message.content
    except Exception:
        return "Journal entry recorded."

def chat_with_companion(message: str, history: list) -> str:
    try:
        messages = [{
            "role": "system",
            "content": "You are WellNest, a compassionate AI mental health companion. Be empathetic, supportive, and encourage professional help when needed. Never diagnose."
        }]
        messages.extend(history[-6:])  # last 3 exchanges
        messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=300
        )
        return response.choices[0].message.content
    except Exception:
        return "I'm here for you. Could you tell me more about how you're feeling?"