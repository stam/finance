from binder.views import ModelView
from ..models.balance import Balance

class BalanceView(ModelView):
    model = Balance
    unwritable_fields = ['created_at', 'updated_at']

    def _store(self, obj, values, request, *args, **kwargs):
        obj.user = request.user
        return super()._store(obj, values, request, *args, **kwargs)
