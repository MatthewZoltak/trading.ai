import sqlalchemy as sa
import logging

from aiohttp import web
from src.db.models.account import Account
from src.db.db import async_session
from src.views.schemas import CreateAccountSchema

from aiohttp_apispec import request_schema


LOGGER = logging.getLogger(__name__)


@request_schema(CreateAccountSchema)
async def create_account(request):
    validated_data = await request.json()

    async with async_session() as session:
        async with session.begin():
            try:
                new_account = Account(
                    name=validated_data["name"],
                    user_id=request["user"].id,
                )
                session.add(new_account)
                await session.flush()
                await session.refresh(new_account)
                await session.commit()

                return web.json_response({"id": new_account.id}, status=201)
            except sa.exc.IntegrityError as e:
                print(f"Integrity Error: {e}")
                await session.rollback()
                return web.json_response({"message": "Database error"}, status=500)
            except KeyError as e:
                print(f"KeyError: {e}")
                await session.rollback()
                return web.json_response(
                    {"message": "Missing required field"}, status=400
                )
            except Exception as e:
                print(f"Unknown Error: {e}")
                await session.rollback()
                return web.json_response({"message": "Unknown error"}, status=500)


async def get_user_accounts(request):
    async with async_session() as session:
        async with session.begin():
            accounts = (
                await session.execute(
                    sa.select(Account).where(Account.user_id == request["user"].id)
                )
            ).scalars().all()
            return web.json_response(
                {"accounts": [{"name":account.name, "id":account.id} for account in accounts]}
            )