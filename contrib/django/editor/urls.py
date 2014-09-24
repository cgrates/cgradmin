from django.conf.urls import patterns, url
from django.contrib.auth.decorators import login_required
from editor import views
from django.views.generic import TemplateView

urlpatterns = patterns('',
                       url(r'^$', login_required(TemplateView.as_view(template_name="index.html"))),
                       url(r'^call/(?P<method>[\w\.]+)$', views.call, name='call'),
                       url(r'^import/$', views.imports, name='imports'),
                       url(r'^exportcdrs/$', views.exports, name='exports'),
)

