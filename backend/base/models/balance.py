from binder.models import BinderModel

from django.db import models


class Balance(BinderModel):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='+')
    after_import = models.ForeignKey('DataImport', related_name='resulting_balance', on_delete=models.CASCADE)

    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
