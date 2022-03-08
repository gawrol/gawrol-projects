import json
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views import View
from td.models import Task
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

# Create your views here.

class IndexView(View):
    def get(self, request):
        return render(request, 'td/index.html')


class ReadView(View):
    def get(self, request):
        if request.user.is_authenticated:
            owner = request.user
            tasks = list(Task.objects.all().filter(owner=owner).order_by('-updated_at').values())
        else:
            tasks = list()
        return JsonResponse({'tasks': tasks})

class CreateView(View):
    def post(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'login': reverse('td:my_login'), 'redirect': request.path})
        desc = json.loads(request.body)['data']
        if len(desc) < 1:
            return JsonResponse({'error': 'more or equal to 1 character'})
        task = Task(desc=desc)
        task.owner = request.user
        task.save()
        taskN = list(Task.objects.filter(desc=desc).values())
        return JsonResponse({'task': taskN})

class UpdateView(View):
    def patch(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'login': reverse('td:my_login'), 'redirect': request.path})
        
        id = json.loads(request.body)['dataId']
        task = Task.objects.get(pk=id)
        if request.user != task.owner:
            return JsonResponse({'error': 'not owner of a task'})

        # request.body to read incoming json
        # json.loads() to convert from JSON to Python dictionary
        # [''] to read key and its value
        desc = json.loads(request.body)['dataText']
        if len(desc) < 1:
            return JsonResponse({'error': 'more or equal to 1 character'})
        task = Task.objects.get(pk=id)
        task.desc = desc
        task.save()
        context = {
            'id': task.id,
            'desc': task.desc, 
        }
        return JsonResponse({'task': context})

class DeleteView(View):
    def delete(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'login': reverse('td:my_login'), 'redirect': request.path})
        
        id = json.loads(request.body)['dataId']
        task = Task.objects.get(pk=id)
        if request.user != task.owner:
            return JsonResponse({'error': 'not owner of a task'})

        context = {
            'id': task.id, 
        }
        task.delete()
        return JsonResponse({'task': context})

class StateView(View):
    def patch(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'login': reverse('td:my_login'), 'redirect': request.path})
        
        id = json.loads(request.body)['dataId']
        task = Task.objects.get(pk=id)
        if request.user != task.owner:
            return JsonResponse({'error': 'not owner of a task'})

        task.state = not task.state
        task.save()
        context = {
            'id': task.id, 
            'state': task.state,
        }
        return JsonResponse({'task': context})

class RegisterView(View):
    def get(self, request):
        return render(request, 'td/register.html')
    def post(self, request):
        username = json.loads(request.body)['data']['user']
        password = json.loads(request.body)['data']['pass']
        if len(username) < 1 or len(password) < 1:
            return JsonResponse({'error': 'more or equal to 1 character'})
        user = User.objects.create_user(username, None, password)
        user.save()
        login(request, user)
        return JsonResponse({'redirect': reverse('td:index'), 'username': user.username})

class LoginView(View):
    def get(self, request):
        return render(request, 'td/login.html')
    def post(self, request):
        username = json.loads(request.body)['data']['user']
        password = json.loads(request.body)['data']['pass']
        if len(username) < 1 or len(password) < 1:
            return JsonResponse({'error': 'more or equal to 1 character'})
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'redirect': reverse('td:index'), 'username': user.username})
        else:
            return JsonResponse({'error': 'wrong username or password'})

class LogoutView(View):
    def get(self, request):
        logout(request)
        return JsonResponse({'redirect': reverse('td:index')})
