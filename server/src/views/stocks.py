import yfinance as yf
from aiohttp import web

async def search_stocks(request):
    """Fetch stock details using yfinance."""
    symbol = request.rel_url.query.get("symbol", "").strip().upper()
    
    if not symbol:
        return web.json_response({"error": "Symbol parameter is required"}, status=400)

    try:
        stock = yf.Ticker(symbol)
        info = stock.history(period="1d")  # Fetch latest data

        if info.empty:
            return web.json_response({"error": "Invalid stock symbol or no data found"}, status=404)

        last_price = info["Close"].iloc[-1]  # Get latest closing price
        return web.json_response({
            "symbol": symbol,
            "name": stock.info.get("shortName", "N/A"),
            "currency": stock.info.get("currency", "USD"),
            "exchange": stock.info.get("exchange", "Unknown"),
            "last_price": last_price
        })

    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)
