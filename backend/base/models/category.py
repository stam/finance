from django.db import models
from mptt.models import MPTTModel, TreeForeignKey


class Category(MPTTModel):
    user = models.ForeignKey('auth.User', null=True, on_delete=models.CASCADE, related_name='categories')
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True, on_delete=models.PROTECT)
    budget = models.ForeignKey('base.Budget', null=True, on_delete=models.SET_NULL, related_name='categories')

    name = models.CharField(max_length=30)
    color = models.CharField(max_length=7)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
