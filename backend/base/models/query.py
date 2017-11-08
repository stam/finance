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
        q = Transaction.objects.filter(user=self.user)

        for m in self.matcher:
            if m['operator'] == 'is':
                qualifier = ''
            else:
                qualifier = '__' + m['operator']

            q = q.filter(**{m['column'] + qualifier: m['value']})

        return q

    def run(self):
        self.matched_transactions().update(
            category_id=self.category_id,
            query_id=self.id
        )

    @classmethod
    def run_all(cls, user):
        queries = cls.objects.filter(user=user).all()

        for q in queries:
            q.run()

    @classmethod
    def post_save(cls, sender, instance=None, created=False, **kwargs):
        # After creating a query, run it on all transactions
        if created and instance:
            instance.run()


post_save.connect(Query.post_save, sender=Query)
