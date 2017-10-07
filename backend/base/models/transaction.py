from django.db import models
from binder.models import BinderModel, ChoiceEnum


class Transaction(BinderModel):
    DIRECTION = ChoiceEnum('incoming', 'outgoing')

    data_import = models.ForeignKey('DataImport', on_delete=models.PROTECT, related_name='transactions')
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='transaction')

    uid = models.TextField()
    date = models.DateField()
    direction = models.TextField(choices=DIRECTION.choices(), default=DIRECTION.OUTGOING)
    description = models.TextField()
    details = models.TextField()
    source_account = models.TextField()
    target_account = models.TextField()
    type = models.TextField()
    amount = models.IntegerField()
