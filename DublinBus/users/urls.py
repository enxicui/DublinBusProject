#accounts/urls.py
from django.urls import path

from . import views


urlpatterns = [
    path('signup/', views.SignUp.as_view(), name='signup'),
    path('m_signup/', views.SignUp.as_view(), name='m_signup'),
    path('addFav/', views.addFav, name='addFav'),
    path('addLocation/', views.addLocation, name ='addLocation'),
]