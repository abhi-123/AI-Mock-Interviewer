import os
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_prompt(data):
    return f"""
You are an expert interviewer with 10+ years of experience across multiple domains (Tech, Banking, SSC, Sales, etc.).

Your task is to generate HIGH-QUALITY, NON-GENERIC interview questions tailored to the candidate profile.

-------------------------
CANDIDATE PROFILE
-------------------------
- Name: {data.name}
- Target Role / Exam: {data.role}
- Level: {data.expLevel}
- Topics / Subjects: {data.skills}
- Focus Areas: {data.context}
- Question Format: {data.questionType}

-------------------------
STRICT RULES
-------------------------
- Questions MUST adapt to the given level
- Avoid generic or textbook questions
- Avoid repetition of common questions
- Questions should feel REAL interview-like
- Prefer scenario-based and applied thinking

-------------------------
DIFFICULTY LOGIC
-------------------------

Beginner:
- Basic understanding
- Simple definitions
- Straightforward examples

Intermediate:
- Real-world use cases
- Debugging scenarios
- “Why” and “How” questions

Advanced:
- System thinking
- Trade-offs
- Edge cases
- Performance considerations
- Architecture-level questions

-------------------------
OUTPUT REQUIREMENTS
-------------------------
- Generate EXACTLY 10 questions
- Do NOT generate less or more than 10
- Ensure the array length is exactly 10
- Keep language clear and professional
- Ensure variety across questions

-------------------------
FORMAT BASED ON QUESTION TYPE
-------------------------

IF Question Format = "MCQ":

- Each MUST include:
  - question
  - 4 options (string array)
  - correct answer (must match one option exactly)
  - explanation (clear reasoning)
  - type = "mcq"

RETURN FORMAT:
[
  {{
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answer": "exact correct option",
    "explanation": "string",
    "type": "mcq"
  }}
]

-------------------------

IF Question Format = "Conceptual":

- Generate deep conceptual questions
- No options
- Include difficulty tag

RETURN FORMAT:
[
  {{
    "question": "string",
    "type": "conceptual",
    "difficulty": "easy | medium | hard"
  }}
]

-------------------------

IF Question Format = "Practical":

- Generate real-world or coding-style problems
- Focus on problem-solving
- Include difficulty

RETURN FORMAT:
[
  {{
    "question": "string",
    "type": "practical",
    "difficulty": "easy | medium | hard"
  }}
]

-------------------------

IMPORTANT:
- RETURN ONLY VALID JSON
- DO NOT include extra text
- DO NOT include explanations outside JSON
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
        response_format={"type": "json_object"}
    )
    content = response.choices[0].message.content
    return json.loads(content)

def generate_evaluation_prompt(data):
    return f"""
You are an experienced interviewer evaluating answers strictly and consistently.

-------------------------
CANDIDATE PROFILE
-------------------------
- Role: {data.role}
- Level: {data.expLevel}

-------------------------
QUESTION
-------------------------
{data.question}

-------------------------
CANDIDATE ANSWER
-------------------------
{data.answer}

-------------------------
EVALUATION RULES (STRICT)
-------------------------
- Be objective and deterministic
- Same answer MUST always produce SAME score
- Do NOT vary scoring randomly
- Avoid vague or generic feedback
- Penalize incorrect or missing concepts clearly
- Reward precise and relevant explanations

-------------------------
SCORING CRITERIA (VERY IMPORTANT)
-------------------------

Correctness (1–10):
- 1–3 → Incorrect / irrelevant
- 4–6 → Partially correct but missing key points
- 7–8 → Mostly correct with minor gaps
- 9–10 → Fully correct and accurate

Clarity (1–10):
- 1–3 → Confusing / unclear
- 4–6 → Understandable but not well explained
- 7–8 → Clear and structured
- 9–10 → Very clear, concise, easy to follow

Depth (1–10):
- 1–3 → Surface-level answer
- 4–6 → Some explanation but lacks depth
- 7–8 → Good depth with reasoning
- 9–10 → Advanced insights, edge cases, trade-offs

Structure (1–10):
- 1–3 → Poor structure
- 4–6 → Basic flow
- 7–8 → Well-organized
- 9–10 → Excellent logical flow

-------------------------
IMPORTANT CONSISTENCY RULE
-------------------------
- Use ONLY the provided answer
- Do NOT assume extra knowledge
- Do NOT hallucinate missing points
- Base score strictly on visible content

-------------------------
OUTPUT FORMAT (STRICT JSON)
-------------------------

Return ONLY valid JSON:
{{
  "breakdown": {{
    "correctness": number,
    "clarity": number,
    "depth": number,
    "structure": number
  }},
  "overall_score": number,
  "feedback": "specific and detailed feedback",
  "strengths": "clear positives",
  "improvements": "specific improvements",
  "correct_approach": "ideal concise answer"
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