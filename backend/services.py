import os
import httpx
from dotenv import load_dotenv
import json
import re

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

async def analyze_idea_with_llm(user_input: str):
    primary_model = "google/gemma-4-26b-a4b-it:free"
    fallback_model = "minimax/minimax-m2.5:free"
    
    prompt = f"""You are an AI thought companion. Convert the following idea into structured insights.
Output ONLY valid JSON matching this schema:
{{
  "summary": "string",
  "insights": ["string"],
  "actions": ["string"],
  "risks": ["string"],
  "opportunities": ["string"]
}}

Idea: {user_input}"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:5173", # Temporary for development
        "X-Title": "GenAI Thought Companion",
        "Content-Type": "application/json"
    }

    # Use OpenRouter providers that support structure or just rely on strong prompt
    payload = {
        "model": primary_model,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(BASE_URL, headers=headers, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            
            # Robust JSON extraction
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                content = match.group(0)
            
            return json.loads(content)
        except Exception as e:
            print(f"Primary model failed: {e}. Trying fallback.")
            # Fallback
            payload["model"] = fallback_model
            try:
                response = await client.post(BASE_URL, headers=headers, json=payload, timeout=30.0)
                response.raise_for_status()
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                
                match = re.search(r'\{.*\}', content, re.DOTALL)
                if match:
                    content = match.group(0)

                return json.loads(content)
            except Exception as fallback_error:
                error_body = response.text if "response" in locals() and hasattr(response, 'text') else ""
                raise Exception(f"Analysis failed. Fallback error: {fallback_error}. Response body: {error_body}")
