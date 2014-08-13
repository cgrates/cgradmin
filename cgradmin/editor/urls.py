from django.conf.urls import patterns, url
from editor import views
from django.views.generic import TemplateView

urlpatterns = patterns('',
                       url(r'^/', TemplateView.as_view(template_name="index.html")),
                       url(r'^call/(?P<method>[\w\.]+)', views.call, name='call'),
)

