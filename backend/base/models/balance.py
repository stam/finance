from binder.models import BinderModel

from django.db import models
from django.db.models import Sum


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
