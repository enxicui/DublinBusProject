# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    favourites = models.CharField(max_length=255)
    places_visited = models.CharField(max_length=255)
    points = models.IntegerField(default=0)
