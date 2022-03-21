from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View

from bk.models import Author, Book

# Create your views here.

class IndexView(View):
    def get(self, request):
        return render(request, 'bk/index.html')

class CreateView(View):
    def post(self, request):
        title = request.POST.get('title')
        authors = request.POST.get('authors')
        b = Book(title=title)
        if not authors:
            a = Author.objects.get_or_create(name='unknown')[0]
        b.save()
        b.authors.add(a)
        return redirect(reverse('bk:index'))