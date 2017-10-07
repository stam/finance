from binder.views import ModelView
from ..models.profile import Profile

class ProfileView(ModelView):
    model = Profile
    unwritable_fields = ['user']
    hidden_fields = ['id', 'created_by']
    route = None
    limit_default = None
