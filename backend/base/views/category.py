from binder.views import ModelView
from binder.router import list_route
from binder.json import JsonResponse
from ..models.category import Category
from ..models.transaction import Transaction
from .transaction import TransactionView
from django.utils.dateparse import parse_date
from django.db.models import Sum, IntegerField, Subquery, OuterRef


class CategoryView(ModelView):
    model = Category
    unwritable_fields = ['created_at', 'updated_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(user=request.user)

    def _store(self, obj, values, request, *args, **kwargs):
        obj.user = request.user
        return super()._store(obj, values, request, *args, **kwargs)

    @list_route(name='aggregate', methods=['GET'])
    def get_aggregate(self, request):
        start_date = parse_date(request.GET.get('start_date'))
        end_date = parse_date(request.GET.get('end_date'))

        # Django doesn't have a decent query builder,
        # so we first get the aggregate for each category
        qs = self.get_queryset(request).order_by('id').filter(user=request.user) \
            .annotate(sum_amount=Subquery(
                Transaction.objects.order_by().filter(
                    category=OuterRef('pk'),
                    date__range=(start_date, end_date)
                ).values('category_id')
                .annotate(sum_amount=Sum('amount')).values('sum_amount'),
                output_field=IntegerField()
            )
        ).values('id', 'name', 'color', 'sum_amount')
        res = list(qs.all())

        # And then we get the aggregate for transactions without category
        sum_category_null = TransactionView().get_queryset(request).order_by().filter(
            user=request.user,
            category__isnull=True,
            date__range=(start_date, end_date)
        ).values('category_id').annotate(
            sum_amount=Sum('amount')
        ).values('sum_amount').all()

        sum_amount = 0
        if len(sum_category_null):
            sum_amount = sum_category_null[0]['sum_amount']

        res.append({
            'id': None,
            'name': None,
            'color': None,
            'sum_amount': sum_amount,
        })

        data = []
        for record in res:
            row = {}
            for k, v in record.items():
                row[k] = v
            data.append(row)

        return JsonResponse({
            'data': data,
            'meta': {
                'total_records': qs.count() + 1
            }
        })
