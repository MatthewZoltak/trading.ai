from src.views.auth import signup, login, profile
from aiohttp import web

routes = [
    web.post("/api/login", login),
    web.post("/api/signup", signup),
    web.get("/api/profile", profile),
]
