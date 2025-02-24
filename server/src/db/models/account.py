from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from src.db.db import Base
from src.db.models.user import User
import datetime


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey(User.id), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(
        DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now
    )

    def __repr__(self):
        return f"<Account(id={self.id}, name='{self.name}')>"
