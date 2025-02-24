from src.views.auth import signup, login, profile
from src.views.accounts import create_account, get_user_accounts
from src.views.stocks import search_stocks
from aiohttp import web

routes = [
    web.post("/api/login", login),
    web.post("/api/signup", signup),
    web.get("/api/profile", profile),
    web.post("/api/accounts", create_account),
    web.get("/api/accounts", get_user_accounts),
    web.get("/api/search/stocks", search_stocks),
]
