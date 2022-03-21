from django.contrib import admin
from bk.models import Book

# Register your models here.


class BookAdmin(admin.ModelAdmin):
    pass
admin.site.register(Book, BookAdmin)