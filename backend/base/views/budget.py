from binder.views import ModelView, JsonResponse
from binder.exceptions import BinderValidationError
from binder.router import list_route
from .transaction import TransactionView
from ..models.budget import Budget


class BudgetView(ModelView):
    model = Budget
    m2m_fields = ['categories']
    unwritable_fields = ['user', 'created_at', 'updated_at']

    @list_route(name='summary', methods=['GET'])
    def chart(self, request):
        tx_qs = TransactionView().get_queryset(request=request)

        budgets = Budget.objects.filter(user=request.user).all()
        cat_to_budget_mapping = {}
        output = {None: {'name': 'Uncategorised', 'total': 0, 'current': 0}}
        for budget in budgets:
            output[budget.id] = {'name': budget.name,
                                 'total': budget.amount, 'current': 0}
            for cat in budget.categories.all():
                cat_to_budget_mapping[cat.id] = budget

        start_date = request.GET.get('start_date', None)
        end_date = request.GET.get('end_date', None)

        if not start_date or not end_date:
            raise BinderValidationError('start_date and end_date are required')

        txs = tx_qs.filter(date__gte=start_date,
                           date__lte=end_date).order_by('date').all()

        for transaction in txs:
            budget_id = None
            if transaction.category_id is not None:
                budget = cat_to_budget_mapping.get(transaction.category_id)
                if budget:
                    budget_id = budget.id

            output[budget_id]['current'] -= transaction.amount

        return JsonResponse({
            'data': list(output.values()),
            'meta': {
                'total_records': len(budgets)
            }
        })
