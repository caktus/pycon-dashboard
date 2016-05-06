import os
import pycountry

from aiohttp import ClientSession, web
from decouple import config


BASE_DIR = os.path.dirname(__file__)


async def index(request):
    """Render the index page."""

    with open(os.path.join(BASE_DIR, 'index.html'), 'rb') as fp:
        return web.Response(body=fp.read(), content_type='text/html')


async def results(request):
    """Fetch remote results forward on."""

    def _derive_mapping_code(response, mapped_totals):
        """Consumes a list of dictionaries and returns a mapping of 2 char
        CC keys and total submissions for each."""
        values = response['values']
        try:
            code = '{0}'.format(
                [x['value'].lower() for x in values if x['label'] == 'country_code'][0],  # noqa
            )
            if code in mapped_totals:
                mapped_totals[code] += 1
            else:
                mapped_totals[code] = 1
        except IndexError:
            """Indicative of an unfinished PollRun in RapidPro."""
            pass
        return mapped_totals

    url = '{RAPIDPRO_API_BASE}/runs.json'.format(**request.app)
    params = {'flow': request.app['RAPIDPRO_FLOW_ID']}
    headers = {'Authorization': 'Token {RAPIDPRO_API_TOKEN}'.format(**request.app)}  # noqa
    mapped_totals = {}
    country_totals = {}
    pony_totals = {}
    with ClientSession() as session:
        async with session.get(url, params=params, headers=headers) as resp:
            result = await resp.json()
            for r in result["results"]:
                mapped_totals = _derive_mapping_code(r, mapped_totals)
                for val in r["values"]:
                    if val["label"] == "pony":
                        answer = val["category"]["base"].lower()
                        if answer in pony_totals:
                            pony_totals[answer] += 1
                        else:
                            pony_totals[answer] = 1
                    if val["label"] == "country_code":
                        try:
                            country = pycountry.countries.get(
                                alpha2=val["text"].upper()).name
                        except KeyError:
                            country = "Other"
                        if country in country_totals:
                            country_totals[country] += 1
                        else:
                            country_totals[country] = 1
            return web.json_response(
                {"map-data":
                    [{"hc-key": key, "value": value} for key, value in mapped_totals.items()],  # noqa
                    "pony-data": pony_totals,
                    "countries-data": country_totals
                })


app = web.Application()
app['RAPIDPRO_API_BASE'] = config('RAPIDPRO_API_BASE', default='https://app.rapidpro.io/api/v1')  # noqa
app['RAPIDPRO_API_TOKEN'] = config('RAPIDPRO_API_TOKEN')
app['RAPIDPRO_FLOW_ID'] = config('RAPIDPRO_FLOW_ID', default='24466')
app.router.add_route('GET', '/', index)
app.router.add_route('GET', '/results.json', results)
app.router.add_static('/static', os.path.join(BASE_DIR, 'static'))


def main(arg):
    return app
