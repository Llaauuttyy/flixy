from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime

from app.model.achievement import Achievement


class UserAchievement(SQLModel, table=True):
    __tablename__ = "user_achievements"

    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    achievement_id: int = Field(foreign_key="achievements.id")
    unlocked_at: datetime = Field(default_factory=datetime.now)

    user: Optional["User"] = Relationship(back_populates="achievements")
    achievement: Optional[Achievement] = Relationship(back_populates="user_achievements")


