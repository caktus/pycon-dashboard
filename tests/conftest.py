import pytest


@pytest.fixture(autouse=True)
def environ(monkeypatch):
    """Patch OS environment variables in the test suite."""

    monkeypatch.setenv('RAPIDPRO_API_BASE', 'http://example.com')
    monkeypatch.setenv('RAPIDPRO_API_TOKEN', 'XXXXXXX')
