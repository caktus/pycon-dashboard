from unittest.mock import Mock

import pytest

from dashboard import index


@pytest.mark.asyncio
async def test_index():
    """Index handler should return a 200."""

    request = Mock()
    res = await index(request)
    assert 200 == res.status
    assert 'text/html' == res.content_type
