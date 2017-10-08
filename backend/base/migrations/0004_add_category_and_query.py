# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-07 11:07
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('base', '0003_auto_20171007_0759'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('color', models.CharField(max_length=7)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('lft', models.PositiveIntegerField(db_index=True, editable=False)),
                ('rght', models.PositiveIntegerField(db_index=True, editable=False)),
                ('tree_id', models.PositiveIntegerField(db_index=True, editable=False)),
                ('level', models.PositiveIntegerField(db_index=True, editable=False)),
                ('parent', mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='children', to='base.Category')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='categories', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Query',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('matcher', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('disabled', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='queries', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['id'],
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='transaction',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='transaction',
            name='category',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='transactions', to='base.Category'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='query',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='transactions', to='base.Query'),
        ),
    ]
