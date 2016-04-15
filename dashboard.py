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
    state_totals = {}
    animal_totals = {}
    with ClientSession() as session:
        async with session.get(url, params=params, headers=headers) as resp:
            result = await resp.json()
            for r in result["results"]:
                for val in r["values"]:
                    if val["label"] == "state_code":
                        state_code = val["text"].lower()
                        if state_code in state_totals:
                            state_totals[state_code] += 1
                        else:
                            state_totals[state_code] = 1
                    if val["label"] == "Animal":
                        animal = val["rule_value"].lower()
                        if animal in animal_totals:
                            animal_totals[animal] += 1
                        else:
                            animal_totals[animal] = 1

            return web.json_response({"map-data":
                [{"hc-key": "us-" + key, "value": value} for key, value in state_totals.items()],
                "animal-data":
                [{"name": key, "y": value} for key, value in animal_totals.items()]
                })


app = web.Application()
app['RAPIDPRO_API_BASE'] = config('RAPIDPRO_API_BASE', default='https://textit.in/api/v1')
app['RAPIDPRO_API_TOKEN'] = config('RAPIDPRO_API_TOKEN')
app['RAPIDPRO_FLOW_ID'] = config('RAPIDPRO_FLOW_ID', default='51432')
app.router.add_route('GET', '/', index)
app.router.add_route('GET', '/results.json', results)
app.router.add_static('/static', os.path.join(BASE_DIR, 'static'))

def main(arg):
    return app
