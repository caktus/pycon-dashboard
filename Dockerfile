FROM python:3.5-onbuild
EXPOSE 8080
CMD ["/usr/local/bin/gunicorn", "--worker-class aiohttp.worker.GunicornWebWorker", "dashboard:app"]
