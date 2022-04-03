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
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

# Create your views here.

errorEmpty = '1 or more characters'
errorUserExists = 'user with suplied username already exists'
errorCredentials = 'wrong username or password'
errorOwner = 'not owner of a task'
errorTaskExists = 'task desc already exists for current user'

# def login_required(func):
#     @wraps(func)
#     def wrapper_login_required(request, *args, **kwargs):
#         if not request.user.is_authenticated:
#             return JsonResponse({'login': reverse('td:my_login')})
#         return func(request, *args, **kwargs)
#     return wrapper_login_required

def empty(input):
    if len(input) < 1:
        return True

def owner(user, owner):
    if user == owner:
        return True

# def task_exists(user, desc):
#     if list(Task.objects.filter(desc__iexact=desc, owner=user).values()):
#         return True

def user_exists(username):
    if list(User.objects.filter(username__iexact=username).values()):
        return True

def query(params):
    if params.get('user'):
        try:
            user = User.objects.get(username__iexact=params.get('user'))
            books = Book.objects.all().filter(owner=user).order_by('-updated_at')
        except:
            books = list()
        return books
    if params.get('author'):
        print(params.get('author'))
        return Book.objects.all().filter(authors__name__icontains=params.get('author')).order_by('-updated_at')

class IndexView(View):
    def get(self, request):
        return render(request, 'bk/index.html')

class ReadView(View):
    def get(self, request):
        booksJSON = list()

        if request.user.is_authenticated:
            if request.GET:
                books = query(request.GET)
            else:
                books = Book.objects.all().filter(owner=request.user).order_by('-updated_at')

            if books:
                booksValues = list(books.values())
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
                            'authorsDB': list(Author.objects.all().values()),
                            'imageLinks': {
                                'thumbnail': booksValues[b]['thumbnail'],
                            },
                        },
                    })
        else:
            if request.GET:
                books = query(request.GET)
                if books:
                    booksValues = list(books.values())
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
                                'authorsDB': list(Author.objects.all().values()),
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

        if not request.user.is_authenticated:
            user = User.objects.get(username='adrian')
        else:
            user = request.user
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
            b = Book(owner=user, title=title)
        else:
            b = Book(owner=user, title=title, thumbnail=thumbnail)
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

class RegisterView(View):
    def get(self, request):
        return render(request, 'bk/register.html')
    def post(self, request):
        username = request.POST.get('user')
        password = request.POST.get('pass')
        if empty(username) or empty(password):
            return JsonResponse({'error': errorEmpty})
        if user_exists(username):
            return JsonResponse({'error': errorUserExists})

        user = User.objects.create_user(username, None, password)
        user.save()
        login(request, user)
        return JsonResponse({'redirect': reverse('bk:index'), 'username': user.username})

class LoginView(View):
    def get(self, request):
        return render(request, 'bk/login.html')
    def post(self, request):
        username = request.POST.get('user')
        password = request.POST.get('pass')
        if empty(username) or empty(password):
            return JsonResponse({'error': errorEmpty})

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'redirect': reverse('bk:index'), 'username': user.username})
        else:
            return JsonResponse({'error': errorCredentials})

class LogoutView(View):
    def get(self, request):
        logout(request)
        return JsonResponse({'redirect': reverse('bk:index')})
