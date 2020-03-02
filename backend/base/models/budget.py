from binder.models import BinderModel

from django.db import models


class Budget(BinderModel):
    def __str__(self):
        return 'Budget: {}'.format(self.name)

    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='budgets')

    name = models.TextField(blank=True)
    amount = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
