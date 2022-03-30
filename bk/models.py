from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

# Create your models here.

class Author(models.Model):
    name = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Language(models.Model):
    name = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

def unknown_language():
    return Language.objects.get_or_create(name='unknown')[0].pk

class Book(models.Model):
    title = models.CharField(max_length=100)
    authors = models.ManyToManyField(Author)
    publisher = models.CharField(max_length=100, blank=True)
    publishedDate = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True)
    pageCount = models.IntegerField(blank=True, null=True)
    categories = models.ManyToManyField(Category, blank=True)
    averageRating = models.FloatField(blank=True, null=True)
    ratingsCount = models.IntegerField(blank=True, null=True)
    language = models.ForeignKey(Language, on_delete=models.SET_DEFAULT, default=unknown_language)
    thumbnail = models.ImageField(upload_to='books/', default='thumbnail.jpg')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title