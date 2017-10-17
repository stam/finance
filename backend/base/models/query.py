from django.db import models
from binder.models import BinderModel
from mptt.models import TreeForeignKey
from .transaction import Transaction

from django.contrib.postgres.fields import JSONField


class Query(BinderModel):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='queries')
    category = TreeForeignKey('Category', related_name='queries', on_delete=models.CASCADE)

    name = models.TextField()
    matcher = JSONField(default={})
    disabled = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def matched_transactions(self):
        return Transaction.objects.filter(
            user=self.user,
            **{self.matcher['column'] + self.qualifier: self.matcher['value']}
        )

    @property
    def qualifier(self):
        if self.matcher['operator'] == 'is':
            return ''
        return '__' + self.matcher['operator']
