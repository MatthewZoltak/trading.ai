from sqlalchemy import Column, Integer, String, DateTime
from src.db.db import Base
import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String)  # Store hashed passwords
    name = Column(String, nullable=False)
    googleId = Column(String, unique=True, nullable=True)
    auth0Id = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(
        DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now
    )

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.name}')>"
