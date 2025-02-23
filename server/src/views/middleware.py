import jose.jwt
import os
from typing import Optional
import logging

from src.db.models.user import User
from src.db.db import async_session

LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.INFO)

async def auth_middleware(app, handler):
    async def middleware_handler(request):
        auth_header = request.headers.get("Authorization")
        if auth_header:
            try:
                token = auth_header.split(" ")[1]
                user_id = decode_token(token, app["JWT_SECRET"], app["ALGORITHM"])
                if user_id is not None:
                    async with async_session() as session:
                        user = await session.get(User, user_id)
                        request["user"] = user
            except (IndexError, ValueError):
                pass
        return await handler(request)

    return middleware_handler


def decode_token(token: str, jwt_secret, algorithm) -> Optional[int]:
    try:
        payload = jose.jwt.decode(token, jwt_secret, algorithms=[algorithm])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return int(user_id)
    except jose.exceptions.JWTError:
        return None
    except ValueError:
        return None


# log all requests and responses
async def log_middleware(app, handler):
    async def middleware_handler(request):
        # Log request method and path
        print(f"Received request: {request.method} {request.path}")

        # Log request JSON data if present
        if request.can_read_body:
            try:
                request_json = await request.json()
                print(f"Request JSON data: {request_json}")
            except Exception:
                print("Request does not contain valid JSON data")

        # Process the request and get the response
        response = await handler(request)

        # Log response status and body
        print(f"Response status: {response.status}")

        return response

    return middleware_handler
