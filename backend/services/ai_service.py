import os

# ✅ Safe OpenAI initialization (won’t crash if no API key)
try:
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key) if api_key else None
except Exception:
    client = None


# 🔹 1. Generate Journal Prompt
def generate_journal_prompt(mood_label: str, mood_score: int, recent_notes: str = "") -> str:
    if client is None:
        return f"You’re feeling {mood_label}. Take a moment to reflect: What is one thing on your mind right now?"

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": "You are a compassionate mental health journaling assistant."
            }, {
                "role": "user",
                "content": f"User feels {mood_label} ({mood_score}/10). Notes: {recent_notes}. Suggest a journaling prompt."
            }],
            max_tokens=150
        )
        return response.choices[0].message.content

    except Exception:
        return "Take a moment to reflect: What is one thing you're grateful for today?"


# 🔹 2. Coping Strategy
def suggest_coping_strategy(mood_label: str, mood_score: int) -> str:
    if client is None:
        return "1. Take deep breaths\n2. Go for a short walk\n3. Talk to someone you trust"

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": "Suggest simple coping strategies in a warm tone."
            }, {
                "role": "user",
                "content": f"Feeling {mood_label} ({mood_score}/10). Suggest 3 coping strategies."
            }],
            max_tokens=200
        )
        return response.choices[0].message.content

    except Exception:
        return "1. Take deep breaths\n2. Relax your mind\n3. Write your thoughts"


# 🔹 3. Journal Summary
def summarize_journal(content: str) -> str:
    if client is None:
        return "Journal entry recorded."

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": "Summarize in 1-2 short sentences."
            }, {
                "role": "user",
                "content": f"Summarize: {content[:1000]}"
            }],
            max_tokens=100
        )
        return response.choices[0].message.content

    except Exception:
        return "Journal entry recorded."


# 🔹 4. Chat Companion
def chat_with_companion(message: str, history: list) -> str:
    if client is None:
        return "I'm here for you. Tell me what's on your mind."

    try:
        messages = [{
            "role": "system",
            "content": "You are a kind and supportive mental health companion."
        }]

        messages.extend(history[-6:])
        messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=300
        )

        return response.choices[0].message.content

    except Exception:
        return "I'm here for you. Could you tell me more?"