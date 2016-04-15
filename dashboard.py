import os

from aiohttp import ClientSession, web
from decouple import config


BASE_DIR = os.path.dirname(__file__)


async def index(request):
    """Render the index page."""

    with open(os.path.join(BASE_DIR, 'index.html'), 'rb') as fp:
        return web.Response(body=fp.read(), content_type='text/html')


async def results(request):
    """Fetch remote results forward on."""

    url = '{RAPIDPRO_API_BASE}/runs.json'.format(**request.app)
    params = {'flow': request.app['RAPIDPRO_FLOW_ID']}
    headers = {'Authorization': 'Token {RAPIDPRO_API_TOKEN}'.format(**request.app)}
    with ClientSession() as session:
        async with session.get(url, params=params, headers=headers) as resp:
            result = await resp.read()
            return web.Response(body=result, content_type='application/json')


app = web.Application()
app['RAPIDPRO_API_BASE'] = config('RAPIDPRO_API_BASE', default='https://textit.in/api/v1')
app['RAPIDPRO_API_TOKEN'] = config('RAPIDPRO_API_TOKEN')
app['RAPIDPRO_FLOW_ID'] = config('RAPIDPRO_FLOW_ID')
app.router.add_route('GET', '/', index)
app.router.add_route('GET', '/results.json', results)
app.router.add_static('/static', os.path.join(BASE_DIR, 'static'))
