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
    color = models.CharField(max_length=7)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return 'Category: {}'.format(self.name)


category_data = [
    {'name': 'Sports & Hobbies', 'color': '#000', 'icon': 'Sport'},
    {'name': 'Entertainment', 'color': '#000', 'icon': 'Entertainment'},
    {'name': 'Travel', 'color': '#000', 'icon': 'Travel'},
    {'name': 'Shopping', 'color': '#000', 'icon': 'Shopping'},
    {'name': 'Groceries', 'color': '#000', 'icon': 'Groceries'},
    {'name': 'Home', 'color': '#000', 'icon': 'Home'},
    {'name': 'Bills & Fees', 'color': '#000', 'icon': 'Bills'},
    {'name': 'Healthcare', 'color': '#000', 'icon': 'Health'},
    {'name': 'Transport', 'color': '#000', 'icon': 'Transport'},
    {'name': 'Car', 'color': '#000', 'icon': 'Car'},
    {'name': 'Work', 'color': '#000', 'icon': 'Work'},
    {'name': 'Other', 'color': '#000', 'icon': 'Other'},
]


def create_categories(sender, instance=None, created=False, **kwargs):
    if not created:
        return

    for cat in category_data:
        category = Category(**cat)
        category.user = instance
        category.save()


post_save.connect(create_categories, sender=User)
