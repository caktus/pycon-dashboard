import os

from aiohttp import web
from decouple import config


async def index(request):
    with open(os.path.join(BASE_DIR, 'index.html'), 'rb') as fp:
        return web.Response(body=fp.read(), content_type='text/html')

BASE_DIR = os.path.dirname(__file__)

app = web.Application()
app.router.add_route('GET', '/', index)
app.router.add_static('/static', os.path.join(BASE_DIR, 'static'))
