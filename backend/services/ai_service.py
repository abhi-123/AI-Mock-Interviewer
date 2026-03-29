import os
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_prompt(data):
    return f"""
You are a senior technical interviewer with 10+ years of experience.

Candidate Profile:
- Name : {data.name}
- Role: {data.role}
- Experience Level: {data.expLevel}
- Skills: {data.skills}
- Additional Context: {data.context}
- Question Type: {data.questionType}

STRICT RULES:
- Questions MUST vary based on experience level
- DO NOT generate common/basic questions unless experience is Beginner
- Avoid repeating standard questions like "What is useEffect?"
- Make questions more complex as experience increases

Experience Guidelines:

Beginner:
- Basic concepts
- Definitions
- Simple examples

Intermediate:
- Real-world scenarios
- Debugging questions
- "Why" and "How" questions

Advanced:
- System design thinking
- Performance optimization
- Edge cases
- Trade-offs
- Architecture decisions

Instructions:
- Generate 10 interview questions
- Focus on real-world scenarios
- Avoid generic questions


IF Question Type = "MCQ":

- Generate 10 MCQs
- Each question must have:
  - 4 options
  - Only ONE correct answer
  - Shuffle options
  - Include explanation

Format:
[
  {{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "correct option",
    "explanation": "why correct"
    "type": "mcq",
  }}
]

---

IF Question Type = "Theory":

- theory → deep conceptual questions
Format:
[
  {{
    "question": "string",
    "type": "{data.questionType}",
    "difficulty": "easy | medium | hard"
  }}
]

---

IF Question Type = "Coding":
-include problem
Format:
[
  {{
    "question": "string",
    "type": "{data.questionType}",
    "difficulty": "easy | medium | hard"
  }}
]

---

Return JSON format:
"""


async def generate_questions(data):
    print(data)
    prompt = generate_prompt(data)

    response = client.chat.completions.create(
       model = "gpt-4o-mini" if not data.isDeep else "gpt-5",
        messages=[
            {"role": "system", "content": "You are a helpful AI interviewer."},
            {"role": "user", "content": prompt},
        ],
        temperature=0,
        response_format={"type": "json_object"}
    )
    content = response.choices[0].message.content
    return json.loads(content)

def generate_evaluation_prompt(data):
    return f"""
You are a senior technical interviewer.

Evaluate the candidate's answer strictly like a real interview.

Candidate Profile:
- Role: {data.role}
- Experience Level: {data.expLevel}

Question:
{data.question}

Your Answer:
{data.answer}

Instructions:
- Score each category from 1 to 10
- Be strict but fair
- Avoid generic feedback
- You must give consistent scoring.
- If the same answer is evaluated multiple times, the score MUST remain the same.
- Do not vary scores randomly.

Evaluation Categories:
1. Correctness (technical accuracy)
2. Clarity (explanation quality)
3. Depth (advanced understanding)
4. Structure (logical flow)

Return ONLY valid JSON (no extra text):

{{
  "breakdown": {{
    "correctness": number,
    "clarity": number,
    "depth": number,
    "structure": number
  }},
  "feedback": "detailed feedback",
  "strengths": "what was good",
  "improvements": "what to improve",
  "correct_approach": "ideal answer summary"
}}
"""

async def evaluate_answer(data):
    prompt = generate_evaluation_prompt(data)

    response = client.chat.completions.create(
        model="gpt-5" if data.answer and len(data.answer) > 50 else "gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a strict technical interviewer."},
            {"role": "user", "content": prompt},
        ],
         temperature=0,
        response_format={"type": "json_object"}

    )

    content = response.choices[0].message.content

    # 🔥 SAFE PARSE
    try:
        parsed = json.loads(content)
    except Exception:
        parsed = {
            "overall_score": 0,
            "breakdown": {
                "correctness": 0,
                "clarity": 0,
                "depth": 0,
                "structure": 0
            },
            "feedback": content,
            "strengths": "",
            "improvements": "",
            "correct_approach": ""
        }

    return parsed