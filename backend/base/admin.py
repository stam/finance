from django.apps import apps
from django.contrib import admin

models = apps.get_models('base')
# app = get_app('my_application_name')
for model in models:
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass
