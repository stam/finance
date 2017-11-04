from binder.views import ModelView
from ..models.aggregate import Aggregate

class AggregateView(ModelView):
    model = Aggregate
    unwritable_fields = ['created_at', 'updated_at']
