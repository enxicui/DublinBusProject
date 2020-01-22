"""dublinbus URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import url
from django.urls import path
from django.contrib.auth import views as auth_views
from django.conf.urls import include
from map.views import map_view
from favourites.views import favourites_view
# from django.urls import include, path
from django.conf.urls import url, include
from journeyplan import views as jpviews
from favourites import views as fviews
from users import views as uview


urlpatterns = [
    path('users/', include('users.urls')),  # new
    path('users/', include('django.contrib.auth.urls')),
    path('admin/', admin.site.urls),
    # path('map/', include('map.urls')),
    path('', map_view.as_view(), name='map'),
    path('favourites/', favourites_view.as_view(), name='favourites'),
    # path('favourites/', include('favourites.urls')),
    path('more/', include('more.urls')),
    path('routes/', include('routes.urls')),
    path('journeyplan/', include('journeyplan.urls')),
    path('realtimeinfo/', include('realtimeinfo.urls')),
    path('jasminetest/', include('jasminetest.urls')),

    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name="login"),
    path('m_favLogin/', auth_views.LoginView.as_view(template_name='mobile/m_favLogin.html'), name="m_favLogin"),
    path('logout/', auth_views.LogoutView.as_view(template_name='logout.html'), name="logout"),
    # path('bus_prediction', jpviews.bus_prediction, name='bus_prediction'),
    path('', jpviews.bus_prediction, name='bus_prediction'),
    path('favourites/delete_fav/', fviews.favourites_view.delete_fav, name='delete_fav'),

    path('m_signup/', uview.SignUp.as_view(template_name='mobile/m_signup.html'), name='m_signup'),
    # path('map/', post_new, name='map'),
]
