# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2019-12-24 11:56
from __future__ import unicode_literals

# https://stackoverflow.com/questions/34534183/django-mptt-raises-django-db-utils-integrityerror-null-value-in-column-lft-vi
from django.db import migrations

category_names = ['Sports & Hobbies', 'Entertainment', 'Travel', 'Shopping',
                  'Groceries', 'Home', 'Bills & Fees', 'Healthcare', 'Transport', 'Car', 'Work', 'Other']


def forwards_func(apps, schema_editor):
    user_id = None
    User = apps.get_model('auth', 'User')
    Category = apps.get_model('base', 'Category')
    admin = User.objects.first()

    if admin is not None:
        user_id = admin.id

    for c_name in category_names:
        c = Category(name=c_name, user_id=user_id, color='#000')
        c.save()


def backwards_func(apps, schema_editor):
    Category = apps.get_model('base', 'Category')
    Category.objects.filter(name__in=category_names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0013_optional_category_user'),
    ]

    operations = [
        migrations.RunPython(
            forwards_func,
            backwards_func
        )
    ]
