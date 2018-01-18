from binder.views import ModelView
from binder.router import list_route
from binder.exceptions import BinderValidationError
from django.http import HttpResponse, JsonResponse
from django.db.models import Sum
from ..models.balance import Balance
from .transaction import TransactionView
from datetime import datetime, timedelta

class BalanceView(ModelView):
    model = Balance
    unwritable_fields = ['created_at', 'updated_at']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(user=request.user)

    def _store(self, obj, values, request, *args, **kwargs):
        obj.user = request.user
        return super()._store(obj, values, request, *args, **kwargs)

    @list_route(name='latest', methods=['GET'])
    def latest(self, request):
        queryset = self.get_queryset(request=request)

        latest = queryset.order_by('-after_import__last_transaction_date').first()

        if not latest:
            return HttpResponse(status=404)

        return self.get(request, pk=latest.pk)

    @list_route(name='chart', methods=['GET'])
    def chart(self, request):
        tx_qs = TransactionView().get_queryset(request=request)

        start_date = request.GET.get('start_date', None)
        end_date = request.GET.get('end_date', None)

        if not start_date or not end_date:
            raise BinderValidationError('start_date and end_date are required')

        txs = tx_qs.filter(date__gte=start_date, date__lte=end_date).order_by('date')


        # Find the initial balance
        starting_balance = Balance.get_at_date(start_date, request.user)
        working_balance = 0
        if starting_balance is not None:
            working_balance = starting_balance

        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

        date_pointer = start_date
        days_per_bin = 1
        bins = []

        while date_pointer < end_date:
            bins.append((date_pointer.strftime('%Y-%m-%d'), working_balance))  # A chart bin is a (date, balance) tuple

            # increment the working balance for every transaction in that bin
            next_date = date_pointer + timedelta(days_per_bin)
            upper_bound = min(end_date, next_date)  # Don't overstep the end_date bound

            balance_change = 0
            txs = tx_qs.filter(date__gte=date_pointer, date__lt=upper_bound).order_by('date')
            if len(txs):
                balance_change = txs.aggregate(result=Sum('amount'))['result']

            working_balance += balance_change
            date_pointer = next_date

        # Add the final bin, this probably isn't necessary if the iteration is better
        bins.append((date_pointer.strftime('%Y-%m-%d'), working_balance))

        return JsonResponse({'data': bins})
