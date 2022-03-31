import json
from django.forms import ImageField
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View
from django.core.validators import URLValidator
from PIL import Image
import requests
from io import BytesIO    
from django.core.files.base import ContentFile
from bk.models import Author, Book

# Create your views here.

class IndexView(View):
    def get(self, request):
        return render(request, 'bk/index.html')

class ReadView(View):
    def get(self, request):
        books = Book.objects.all().order_by('-updated_at')
        booksValues = list(books.values())
        booksJSON = list()
        if booksValues:
            for b in range(len(booksValues)):
                authors = list(books[b].authors.all())
                if authors:
                    authorsJSON = list()
                    for a in range(len(authors)):
                        authorsJSON.append(authors[a].name)
                booksJSON.append({
                    'id': booksValues[b]['id'],
                    'volumeInfo': {
                        'title': booksValues[b]['title'],
                        'authors': authorsJSON,
                        'imageLinks': {
                            'thumbnail': booksValues[b]['thumbnail'],
                        },
                    },
                })
        return JsonResponse({'books': booksJSON})

class CreateView(View):
    def post(self, request):
        book = request.POST
        id = book.get('id')
        title = book.get('volumeInfo.title')
        authors = json.loads(book.get('volumeInfo.authors'))
        thumbUrl = book.get('volumeInfo.imageLinks.thumbUrl')
        thumbFile = request.FILES.get('volumeInfo.imageLinks.thumbFile')
        authorsCache = list(authors)

        if not authors:
            authors.append(Author.objects.get_or_create(name='unknown')[0])
            authorsCache.append('unknown')
        else:
            for a in range(len(authors)):
                authors[a] = Author.objects.get_or_create(name=authors[a])[0]
        
        # try, except - verify if thumbnail URL is valid
        thumbUrlValidator = URLValidator()
        try:
            thumbUrlValidator(thumbUrl)
            # , if valid, stream to memory
            response = requests.get(thumbUrl, stream=True)
            imgUrl = Image.open(response.raw)
            imgCopy = imgUrl.copy()
            buffer = BytesIO()
            imgCopy.save(buffer, format='JPEG')
            imgTmp = ContentFile(buffer.getvalue(), id)

            # try except if streamed file is not an image; using to_python method from ImageField class
            imageValidator = ImageField()
            try:
                imageValidator.to_python(imgTmp)
                thumbnail = imgTmp
            except:
                thumbnail = None
            
        except:
            # if url is false, check if added file is an image
            imageValidator = ImageField()
            try:
                imageValidator.to_python(thumbFile)
                thumbnail = thumbFile
            except:
                thumbnail = None

        if thumbnail is None:
            b = Book(title=title)
        else:
            b = Book(title=title, thumbnail=thumbnail)
        b.save()

        for a in range(len(authors)):
            b.authors.add(authors[a])

        context = {
            'id': b.pk,
            'idCache': id,
            'volumeInfo': {
                'title': title,
                'authors': authorsCache, 
                'imageLinks': {
                    'thumbnail': str(b.thumbnail),
                },
            },
        }
        return JsonResponse({'book': context})

class DeleteView(View):
    def post(self, request):
        id = request.POST.get('id')

        b = Book.objects.get(pk=id)
        b.delete()

        context = {
            'id': id,
        }
        return JsonResponse({'book': context})