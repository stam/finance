from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User

from binder.models import BinderModel


class Category(BinderModel):
    user = models.ForeignKey(
        'auth.User', null=True, on_delete=models.CASCADE, related_name='categories')
    budget = models.ForeignKey('base.Budget', null=True, blank=True,
                               on_delete=models.SET_NULL, related_name='categories')

    name = models.CharField(max_length=30)
    icon = models.CharField(null=True, blank=True, max_length=30)
    color = models.CharField(max_length=30)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return 'Category: {}'.format(self.name)


category_data = [
    {'name': 'Activities',
        'color': 'var(--data-color-0)', 'icon': 'Activities'},
    {'name': 'Bills & Fees', 'color': 'var(--data-color-1)', 'icon': 'Bills'},
    {'name': 'Eating out',
        'color': 'var(--data-color-2)', 'icon': 'EatingOut'},
    {'name': 'Groceries', 'color': 'var(--data-color-3)', 'icon': 'Groceries'},
    {'name': 'Rent', 'color': 'var(--data-color-4)', 'icon': 'Home'},
    {'name': 'Saving', 'color': 'var(--data-color-5)', 'icon': 'Wallet'},
    {'name': 'Shopping', 'color': 'var(--data-color-6)', 'icon': 'Shopping'},
    {'name': 'Sports', 'color': 'var(--data-color-7)', 'icon': 'Sport'},
    {'name': 'Transport', 'color': 'var(--data-color-8)', 'icon': 'Transport'},
    {'name': 'Travel', 'color': 'var(--data-color-9)', 'icon': 'Travel'},
    {'name': 'Work', 'color': 'var(--data-color-10)', 'icon': 'Work'},
]


def create_categories(sender, instance=None, created=False, **kwargs):
    if not created:
        return

    for cat in category_data:
        category = Category(**cat)
        category.user = instance
        category.save()


post_save.connect(create_categories, sender=User)
