import bcrypt
import jose.jwt
import jose.exceptions
import datetime
import os
from aiohttp import web
import sqlalchemy as sa
import logging

from src.db.models.user import User
from src.db.db import async_session
from src.views.schemas import SignupSchema, LoginSchema, UserSchema
from sqlalchemy.exc import IntegrityError

from aiohttp_apispec import request_schema


LOGGER = logging.getLogger(__name__)


def generate_token(user_id: int, jwt_secret, algorithm) -> str:
    expire = datetime.datetime.now() + datetime.timedelta(days=1)
    to_encode = {"sub": str(user_id), "exp": expire}
    encoded_jwt = jose.jwt.encode(to_encode, jwt_secret, algorithm=algorithm)
    return encoded_jwt


@request_schema(SignupSchema)
async def signup(request):
    jwt_secret = request.app["JWT_SECRET"]
    algorithm = request.app["ALGORITHM"]
    validated_data = await request.json()
    hashed_password = bcrypt.hashpw(
        validated_data["password"].encode("utf-8"), bcrypt.gensalt()
    )

    async with async_session() as session:
        async with session.begin():
            try:
                new_user = User(
                    email=validated_data["email"],
                    password=hashed_password.decode("utf-8"),
                    name=validated_data["name"],
                )
                session.add(new_user)
                await session.flush()
                await session.refresh(new_user)
                token = generate_token(new_user.id, jwt_secret, algorithm)
                await session.commit()

                return web.json_response({"token": token}, status=201)
            except IntegrityError as e:
                await session.rollback()
                if "UNIQUE constraint failed: users.email" in str(e):
                    return web.json_response(
                        {"message": "Email already in use"}, status=409
                    )
                else:
                    return web.json_response({"message": "Database error"}, status=500)
    print(f"Signup Error: {e}")
    return web.json_response({"message": "Signup failed"}, status=500)


@request_schema(LoginSchema)
async def login(request):
    try:
        validated_data = await request.json()

        async with async_session() as session:
            user = await session.execute(
                sa.select(User).where(User.email == validated_data["email"])
            )
            user = user.scalars().first()

            if not user:
                return web.json_response({"message": "Invalid credentials"}, status=401)

            if not bcrypt.checkpw(
                validated_data["password"].encode("utf-8"),
                user.password.encode("utf-8"),
            ):
                return web.json_response({"message": "Invalid credentials"}, status=401)

            token = generate_token(
                user.id, request.app["JWT_SECRET"], request.app["ALGORITHM"]
            )
            return web.json_response({"token": token})

    except Exception as e:
        print(f"Login Error: {e}")
        return web.json_response({"message": "Login failed"}, status=500)


async def profile(request):
    if not request.get("user"):
        return web.json_response({"message": "Unauthorized"}, status=401)

    return web.json_response(UserSchema().dump(request.get("user")))
