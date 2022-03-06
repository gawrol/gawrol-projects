from django.db import models

# Create your models here.

class Task(models.Model):
    desc = models.CharField(max_length=64, unique=True)
    state = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.desc