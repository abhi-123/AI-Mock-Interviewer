from pydantic import BaseModel
from typing import List, Optional


class InterviewRequest(BaseModel):
    name: str
    role: str
    expLevel: str
    questionType: str  # mcq | theory | coding
    skills: Optional[str] = ""
    context: Optional[str] = ""
    isDeep: Optional[bool] = False