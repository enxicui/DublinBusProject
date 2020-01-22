from django.urls import path

from . import views

# from views import favourites

urlpatterns = [
    path('', views.favourites, name='favourites'),

]
