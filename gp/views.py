from django.http import HttpResponse
from django.shortcuts import reverse

def home(request):
    return HttpResponse('Todo app: <a href="'+reverse('td:index')+'">click</a></br>Book app: <a href="'+reverse('bk:index')+'">click</a></br>')