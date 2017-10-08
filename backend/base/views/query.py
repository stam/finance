from binder.views import ModelView
from ..models.query import Query

class QueryView(ModelView):
    model = Query
    unwritable_fields = ['created_at', 'updated_at']
