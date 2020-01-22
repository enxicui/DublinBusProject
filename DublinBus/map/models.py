from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=500)
    text = models.CharField(max_length=500)

