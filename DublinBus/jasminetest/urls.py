from django.urls import path
from django.conf.urls import include, url
from django.contrib import admin
from . import views

urlpatterns = [
    path('', views.jasminetest, name='jasminetest'),
    path('jasminetest', views.jasminetest, name='jasminetest'),
]
