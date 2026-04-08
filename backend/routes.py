from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from models import IdeaRequest, IdeaResponse
from services import analyze_idea_with_llm
from database import get_db, IdeaRecord

router = APIRouter()

@router.post("/analyze", response_model=IdeaResponse)
async def analyze_idea(request: IdeaRequest, db: AsyncSession = Depends(get_db)):
    try:
        result = await analyze_idea_with_llm(request.user_input)
        
        # Save to DB
        new_record = IdeaRecord(
            user_input=request.user_input,
            summary=result.get("summary", ""),
            insights=result.get("insights", []),
            actions=result.get("actions", []),
            risks=result.get("risks", []),
            opportunities=result.get("opportunities", [])
        )
        db.add(new_record)
        await db.commit()
        await db.refresh(new_record)

        return IdeaResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
