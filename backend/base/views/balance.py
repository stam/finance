from binder.views import ModelView
from binder.router import list_route
from django.http import HttpResponse
from ..models.balance import Balance

class BalanceView(ModelView):
    model = Balance
    unwritable_fields = ['created_at', 'updated_at']

    def _store(self, obj, values, request, *args, **kwargs):
        obj.user = request.user
        return super()._store(obj, values, request, *args, **kwargs)

    @list_route(name='latest', methods=['GET'])
    def latest(self, request):
        queryset = self.get_queryset(request=request)

        # TODO: calculate based on passed transactions since balance
        latest = queryset.order_by('-after_transaction__date').first()

        if not latest:
            return HttpResponse(status=404)

        return self.get(request, pk=latest.pk)
