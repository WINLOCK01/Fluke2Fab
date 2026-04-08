import asyncio
from services import analyze_idea_with_llm

async def main():
    idea = "Build a fitness app that tracks workouts using AI posture estimation and offers weekly recovery plans."
    res = await analyze_idea_with_llm(idea)
    print("SUCCESS!")
    from pprint import pprint
    pprint(res)

asyncio.run(main())
