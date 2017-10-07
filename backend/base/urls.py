from base.views.bootstrap import bootstrap
from django.conf.urls import url, include
import base.views  # noqa
import binder

router = binder.router.Router().register(binder.views.ModelView)

# Note that these are all mounted under /api/ by the root application
urlpatterns = [
    url(r'^bootstrap/$', bootstrap, {'router': router}, name='bootstrap'),
    url(r'^', include(router.urls)),
    url(r'^', binder.views.api_catchall, name='catchall'),
]

# TODO: Hmm, this is a bit hackish. Especially here. But where else?
binder.models.install_m2m_signal_handlers(binder.models.BinderModel)
