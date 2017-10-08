from django.db import models
from binder.models import BinderModel
from django.contrib.postgres.fields import JSONField


class Query(BinderModel):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='queries')

    matcher = JSONField(default={})
    disabled = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
