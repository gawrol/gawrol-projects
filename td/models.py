from django.db import models
from django.core.validators import MinLengthValidator

# Create your models here.

class Task(models.Model):
    desc = models.CharField(max_length=64, unique=True, validators=[MinLengthValidator(1)])
    state = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.desc