from django.conf import settings
from django.db import models

# Create your models here.

class Task(models.Model):
    desc = models.CharField(max_length=64, unique=True)
    state = models.BooleanField(default=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.desc