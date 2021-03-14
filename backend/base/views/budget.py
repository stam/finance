from binder.views import ModelView, JsonResponse
from binder.exceptions import BinderValidationError
from binder.router import list_route
from .transaction import TransactionView
from ..models.budget import Budget
from ..models.category import Category


class BudgetView(ModelView):
    model = Budget
    m2m_fields = ['categories']
    unwritable_fields = ['user', 'created_at', 'updated_at']

    def _store(self, obj, values, request, *args, **kwargs):
        obj.user = request.user
        return super()._store(obj, values, request, *args, **kwargs)

    @list_route(name='summary', methods=['GET'])
    def chart(self, request):
        tx_qs = TransactionView().get_queryset(request=request)

        c_saving = Category.objects.filter(name='Saving', user=request.user).first()
        c_work = Category.objects.filter(name='Work', user=request.user).first()

        print(c_work.id)

        BUCKET_INCOME = 'Income'
        BUCKET_SAVING = 'Saving'
        BUCKET_SPENT = 'Total_spent',

        # find income from last month
        # find saving from this month

        budgets = Budget.objects.filter(user=request.user).all()
        cat_to_budget_mapping = {}
        output = {
            None: {'name': 'Uncategorised', 'total': 0, 'current': 0, 'count': 0},
            BUCKET_SAVING: {'name': 'Saving', 'total': -1, 'current': 0, 'count': 0},
            BUCKET_INCOME: {'name': 'Income', 'total': -1, 'current': 0, 'count': 0},
            BUCKET_SPENT: {'name': 'Total spent', 'total': -1, 'current': 0, 'count': 0},
        }
        for budget in budgets:
            output[budget.id] = {'name': budget.name,
                                 'total': budget.amount, 'current': 0, 'count': 0}
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
                if transaction.category_id == c_saving.id:
                    budget_id = BUCKET_SAVING
                elif transaction.category_id == c_work.id:
                    budget_id = BUCKET_INCOME
                else:
                    budget = cat_to_budget_mapping.get(transaction.category_id)

                    output[BUCKET_SPENT]['current'] -= transaction.amount
                    output[BUCKET_SPENT]['count'] += 1

                    if budget:
                        budget_id = budget.id

            output[budget_id]['current'] -= transaction.amount
            output[budget_id]['count'] += 1

        return JsonResponse({
            'data': list(output.values()),
            'meta': {
                'total_records': len(budgets)
            }
        })
