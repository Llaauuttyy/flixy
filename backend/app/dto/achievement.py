from typing import Optional
from pydantic import BaseModel
from datetime import datetime as datetime

class AchievementDTO(BaseModel):
    name: str
    description: str
    icon_name: str
    color: str
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None

class AchievementsDTO(BaseModel):
    achievements: list[AchievementDTO] = []

