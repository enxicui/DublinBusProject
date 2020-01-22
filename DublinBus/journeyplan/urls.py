from django.urls import path

from . import views
# from views import journeyplan

urlpatterns = [
    path('', views.journeyplan, name='journeyplan'),
    path('bus_prediction', views.bus_prediction, name='bus_prediction'),
    path('addCO2', views.addCO2, name='addCO2'),
]