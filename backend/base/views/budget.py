from binder.views import ModelView
from ..models.budget import Budget

class BudgetView(ModelView):
    model = Budget
    unwritable_fields = ['user', 'created_at', 'updated_at']
