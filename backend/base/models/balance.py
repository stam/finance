from binder.models import BinderModel
from .transaction import Transaction
from .data_import import DataImport

from django.db import models
from django.db.models import Sum

from datetime import datetime, timedelta

class Balance(BinderModel):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='+')
    after_import = models.ForeignKey('DataImport', related_name='resulting_balance', on_delete=models.CASCADE)

    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def recalculate(cls, data_import):
        # Update the balance for newly imported transactions
        user = data_import.user
        latest_balance = cls.objects.filter(user=user).order_by('-after_import__last_transaction_date').first()

        if not latest_balance:
            return

        # Find the queryset of later transactions
        # last_transaction = latest_balance.data_import.transactions.order_by('-date').first()
        previous_balance_date = latest_balance.after_import.last_transaction_date
        new_transactions = data_import.transactions.filter(date__gte=previous_balance_date, data_import=data_import)

        # Currently only works for data_imports with later transactions
        # than the previous imports.
        if new_transactions.count() == 0:
            return

        diff = new_transactions.aggregate(result=Sum('amount'))['result']
        resulting_balance = latest_balance.amount + diff
        new_balance = cls(user=user, after_import=data_import, amount=resulting_balance)
        return new_balance.save()

    @classmethod
    def get_at_date(cls, date_str, user):
        closest = DataImport.objects.raw(
            'SELECT * FROM base_dataimport WHERE user_id = %s ORDER BY abs(last_transaction_date - date %s) LIMIT 1',
            [user.id, date_str])

        closest = list(closest)

        if len(closest) == 0:
            return None

        closest_dataimport = closest[0]
        closest_balance = closest_dataimport.resulting_balance.first()
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        date_bounds = [target_date, closest_dataimport.last_transaction_date]
        date_bounds.sort()

        if target_date < closest_dataimport.last_transaction_date:
            # If the target_date is before the last_txn_date
            # We need to remove the transaction amount sum ONLY OF THAT DATAIMPORT
            # from the balance
            result = Transaction.objects.filter(
                user=user, date__range=[*date_bounds], data_import=closest_dataimport).aggregate(result=Sum('amount'))['result']
            if result is None:
                result = 0

            return closest_balance.amount - result

        # If the target_date is after the last_txn_date
        # We need to add the transaction amount sum of the transactions NOT from that dataimport
        # to the balance
        result = Transaction.objects.filter(
            user=user, date__range=[*date_bounds]).exclude(data_import=closest_dataimport).aggregate(result=Sum('amount'))['result']
        if result is None:
            result = 0

        return closest_balance.amount + result
#         #     # date_bounds =
#         # else:
#         # date_bounds[0] = date_bounds[0] + timedelta(days=1)

#         # Get all transactions between the closest balance calculation and the target date

#         from pudb import set_trace; set_trace()

#         # Calculate the target balance by removing or adding the sum amount of the transactions
#         if target_date < anchor.last_transaction_date:



#         '''
#         SELECT * FROM base_dataimport WHERE user = 1 ORDER BY abs(last_transaction_date - date 2018-01-07) LIMIT 1;
#         '''
# #         SELECT year, session_date
# # FROM calendar_dates
# # WHERE session_date < '$date_string'
# # ORDER BY session_date DESC
# # LIMIT 1;
#         # Find the nearest balance, calculate the difference by aggregating
#         # Get at start of date, before any transactions happened
#         return 0  # todo
