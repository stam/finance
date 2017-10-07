from django.conf.urls import include, url
from django.contrib import admin

import base.urls


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # All actual application URIs are under /api/
    url(r'^api/', include(base.urls)),
]
