from binder.views import ModelView
from ..models.transaction import Transaction

class TransactionView(ModelView):
    model = Transaction
    unwritable_fields = ['uid', 'user', 'date', 'direction', 'source_account', 'target_account', 'type', 'amount']
