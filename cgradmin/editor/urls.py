from django.conf.urls import patterns, url
from editor import views

urlpatterns = patterns('',
                        url(r'editor/(?P<method>[\w\.]+)', views.index, name='main'),
)

