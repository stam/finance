from django.contrib import auth
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.debug import sensitive_post_parameters

from binder.json import jsonloads, JsonResponse
from binder.router import list_route
from binder.exceptions import BinderMethodNotAllowed, BinderNotAuthenticated
from binder.permissions.views import ModelView, no_scoping_required

from ..models.profile import User


# We could use a TenantScopeView here
# But that View extends _store
# And this view calls super().store for both user & profile which breaks stuff (it tries to set user.tenant)
class UserView(ModelView):
    model = User
    hidden_fields = ['password']
    unwritable_fields = ['password', 'user_permissions', 'is_staff', 'is_superuser', 'last_login', 'date_joined', 'permissions', 'is_active']
    m2m_fields = ['groups']
    searches = ['username__istartswith', 'first_name__icontains', 'last_name__icontains']


    @method_decorator(sensitive_post_parameters())
    @list_route(name='login', unauthenticated=True)
    @no_scoping_required()
    def login(self, request):
        data = jsonloads(request.body)
        username = data.get('username', '').lower()
        password = data.get('password', '')
        if request.method != 'POST':
            raise BinderMethodNotAllowed()


        user = auth.authenticate(username=username, password=password)

        if user is None:
            raise BinderNotAuthenticated()

        auth.login(request, user)
        return JsonResponse(UserView()._get_obj(user.id, request=request))

    @list_route(name='logout')
    @no_scoping_required()
    def logout(self, request):
        if request.method != 'POST':
            raise BinderMethodNotAllowed()

        auth.logout(request)
        return HttpResponse(status=204)
