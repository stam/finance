from django.db import models
from binder.models import BinderModel


class DataImport(BinderModel):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='data_imports')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    filename = models.TextField()
    first_transaction_date = models.DateField()
    last_transaction_date = models.DateField()
