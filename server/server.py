# server.py
import os
import logging
from aiohttp import web
import aiohttp_cors
from dotenv import load_dotenv

from src.views.middleware import auth_middleware, log_middleware
from src.db.db import engine, Base
from src.views.routes import routes

# Import aiohttp-apispec
from aiohttp_apispec import setup_aiohttp_apispec

load_dotenv()


PORT = int(os.getenv("PORT"))
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"


async def on_shutdown(app):
    """Gracefully close the database connection on shutdown."""
    await engine.dispose()
    print("Database connection closed.")


async def create_app():
    app = web.Application(middlewares=[auth_middleware, log_middleware])

    # Configure CORS
    cors = aiohttp_cors.setup(
        app,
        defaults={
            "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True,
                expose_headers="*",
                allow_headers="*",
            )
        },
    )

    app.add_routes(routes)

    # Configure CORS on all routes
    # Apply CORS to *all* routes in the application (after adding them)
    for route in list(app.router.routes()):
        cors.add(route)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    setup_aiohttp_apispec(
        app=app,
        title="Wealthsimple API",
        version="v1",
        url="/api/docs/swagger.json",
        swagger_path="/api/docs",
    )

    # Register the shutdown handler
    app.on_shutdown.append(on_shutdown)

    app["JWT_SECRET"] = JWT_SECRET
    app["ALGORITHM"] = ALGORITHM

    return app


if __name__ == "__main__":
    app = create_app()  # Get the app instance
    print(f"Starting server on port {PORT}")
    web.run_app(app, port=PORT)
