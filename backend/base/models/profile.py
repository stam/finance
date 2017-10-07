from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User

from binder.models import BinderModel


class Profile(BinderModel):
    class Meta:
        ordering = ['user_id']

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='profile')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='created_users', null=True, blank=True)

    def __str__(self):
        return self.user.username


def create_profile(sender, instance=None, created=False, **kwargs):
    if created:
        profile = Profile()
        profile.user = instance
        profile.save()

post_save.connect(create_profile, sender=User)
