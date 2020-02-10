from binder.views import ModelView, JsonResponse
from binder.router import list_route
# from .category import CategoryView
from ..models.budget import Budget

class BudgetView(ModelView):
    model = Budget
    unwritable_fields = ['user', 'created_at', 'updated_at']

    @list_route(name='summary', methods=['GET'])
    def chart(self, request):
        # Find all categories
        # cat_qs = CategoryView().get_queryset(request=request)

        budgets = Budget.objects.filter(user=request.user)

        data = []
        for budget in budgets:
            row = {}
            row["total"] = budget.amount
            row["current"] = 0
            row["name"] = budget.name
            data.append(row)

        return JsonResponse({
            'data': data,
            'meta': {
                'total_records': len(budgets)
            }
        })

        # start_date = request.GET.get('start_date', None)
        # end_date = request.GET.get('end_date', None)

        # if not start_date or not end_date:
        #     raise BinderValidationError('start_date and end_date are required')

        # txs = tx_qs.filter(date__gte=start_date, date__lte=end_date).order_by('date')
