from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime as datetime


class Achievement(SQLModel, table=True):
    __tablename__ = "achievements"

    id: int = Field(default=None, primary_key=True)
    name: str
    description: str
    icon_name: str
    color: str
    unlock_conditions: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    user_achievements: list["UserAchievement"] = Relationship(back_populates="achievement")


