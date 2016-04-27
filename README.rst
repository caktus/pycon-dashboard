RapidPro Dashboard
==================

A small dashboard for visualizing a single poll/flow from RapidPro.


Dev Setup
---------

This requires Python 3.5 and the additional requirements are listed in the ``requirements.txt`` file::

    mkvirtualenv rapidpro-dashboard -p `which python3.5`
    pip install -r requirements.txt

To run the project you'll need to include your RapidPro API token and the flow ID you want to render
in a ``.env`` file::

    echo "RAPIDPRO_API_TOKEN='XXXXXXX'" >> .env

If you need to overwrite the flow ID for your rapidpro flow, you can run this setting too, but this THIS STEP IS NOT REQUIRED::

    echo "RAPIDPRO_FLOW_ID='XXXXXX'" >> .env

This assumes that the poll is hosted on ``app.rapidpro.io`` by default. If you need to change the RapidPro domain then you can optionally set the ``RAPIDPRO_API_BASE`` as well::

    echo "RAPIDPRO_API_BASE='https://rapidpro.example.com/api/v1'" >> .env


Running the Server
------------------

The server is run through Gunicorn via::

    gunicorn dashboard:app --bind localhost:8080 --worker-class aiohttp.worker.GunicornWebWorker

This serves the ``index.html`` on ``http://localhost:8080``. The poll results for the configured flow
can be accessed on ``http://localhost:8080/results.json``.
