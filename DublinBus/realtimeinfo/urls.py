from django.urls import path

from . import views

# from views import more

urlpatterns = [
    path('<int:id>', views.realtimeinfo, name='realtimeinfo'),
]
