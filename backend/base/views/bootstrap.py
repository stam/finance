import logging
import json

from django.middleware import csrf
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET

from binder.views import JsonResponse

# TODO: This doesn't _really_ belong here, does it?
from .user import UserView

logger = logging.getLogger(__name__)


# Basic bootstrap data needed by the front-end
@require_GET
@ensure_csrf_cookie
def bootstrap(request, router):
    if request.user.is_authenticated:
        view = UserView()
        view.router = router
        response = view.get(pk=request.user.id, request=request)
        rdata = json.loads(response.content.decode())
        user = rdata['data']
    else:
        user = None

    return JsonResponse({
        'user': user,
        'csrf_token': csrf.get_token(request),
    })
