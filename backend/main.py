from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models.request_models import InterviewRequest
from services.ai_service import generate_questions
from models.evaluation_model import EvaluationRequest
from services.ai_service import evaluate_answer

app = FastAPI()

# ✅ CORS (React/JS connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 sab allow (dev ke liye)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/generate-questions")
async def generate_interview_questions(data: InterviewRequest):
    try:
        result = await generate_questions(data)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate-answer")
async def evaluate(data: EvaluationRequest):
    try:
        result = await evaluate_answer(data)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))