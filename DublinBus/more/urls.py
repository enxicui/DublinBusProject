from django.urls import path

from . import views
# from views import more

urlpatterns = [
    path('', views.more, name='more'),
]