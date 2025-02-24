from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String
import datetime
from src.db.db import Base



class AccountStock(Base):
    __tablename__ = "account_stocks"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    stock_ticker = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)  # Number of shares
    avg_price = Column(Float, nullable=False, default=0.0)  # Average purchase price

    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(
        DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now
    )


    def __repr__(self):
        return f"<AccountStock(account_id={self.account_id}, stock_id={self.stock_ticker}, quantity={self.quantity})>"
