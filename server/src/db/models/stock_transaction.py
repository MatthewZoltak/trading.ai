from sqlalchemy import Column, Integer, Float, DateTime, Enum, ForeignKey, String
import datetime
from src.db.db import Base



class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    stock_ticker = Column(String, nullable=False)
    type = Column(Enum("buy", "sell", name="transaction_type"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_per_share = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)

    def __repr__(self):
        return f"<Transaction(account_id={self.account_id}, stock_id={self.stock_ticker}, type={self.type}, quantity={self.quantity}, price={self.price_per_share})>"
