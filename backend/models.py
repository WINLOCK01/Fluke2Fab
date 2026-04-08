from pydantic import BaseModel
from typing import List

class IdeaRequest(BaseModel):
    user_input: str

class IdeaResponse(BaseModel):
    summary: str
    insights: List[str]
    actions: List[str]
    risks: List[str]
    opportunities: List[str]
