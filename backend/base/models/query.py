from mptt.models import TreeForeignKey
from .transaction import Transaction

from binder.models import BinderModel

from django.db import models
from django.db.models.signals import post_save
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

    @classmethod
    def post_save(cls, sender, instance=None, created=False, **kwargs):
        # After creating a query, run it on all transactions
        if created and instance:
            instance.matched_transactions().update(
                category_id=instance.category_id,
                query_id=instance.id
            )


post_save.connect(Query.post_save, sender=Query)
