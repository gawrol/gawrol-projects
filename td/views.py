import json
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views import View
from td.models import Task
from django.http import JsonResponse

# Create your views here.

class IndexView(View):
    def get(self, request):
        # tasksC= list(Task.objects.filter(state=True).order_by('-updated_at').values())
        # tasksNC = list(Task.objects.filter(state=False).order_by('-updated_at').values())
        # context = {
        #     'tasksC': tasksC,
        #     'tasksNC': tasksNC,
        # }
        # return render(request, 'td/index.html', context=context)
        return render(request, 'td/index.html')


class ReadView(View):
    def get(self, request):
        tasks = list(Task.objects.all().order_by('-updated_at').values())
        return JsonResponse({'tasks': tasks})

class CreateView(View):
    def post(self, request):
        desc = json.loads(request.body)['data']
        if len(desc) < 1:
            return JsonResponse({})
        task = Task(desc=desc)
        task.save()
        taskN = list(Task.objects.filter(desc=desc).values())
        return JsonResponse({'task': taskN})

class UpdateView(View):
    def patch(self, request, id):
        # request.body to read incoming json
        # json.loads() to convert from JSON to Python dictionary
        # [''] to read key and its value
        desc = json.loads(request.body)['data']
        if len(desc) < 1:
            return JsonResponse({})
        task = Task.objects.get(id=id)
        task.desc = desc
        task.save()
        context = {
            'id': task.id,
            'desc': task.desc, 
        }
        return JsonResponse({'task': context})

class DeleteView(View):
    def delete(self, request, id):
        task = Task.objects.get(id=id)
        context = {
            'id': task.id, 
        }
        task.delete()
        return JsonResponse({'task': context})

class StateView(View):
    def post(self, request, id):
        task = Task.objects.get(id=id)
        task.state = not task.state
        task.save()
        context = {
            'id': task.id, 
            'state': task.state,
        }
        return JsonResponse({'task': context})