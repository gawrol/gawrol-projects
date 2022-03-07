from django.shortcuts import redirect, render
from django.urls import reverse
from django.views import View
from td.models import Task
from django.http import JsonResponse

# Create your views here.

class IndexView(View):
    def get(self, request):
        tasksC= list(Task.objects.filter(state=True).order_by('-updated_at').values())
        tasksNC = list(Task.objects.filter(state=False).order_by('-updated_at').values())
        context = {
            'tasksC': tasksC,
            'tasksNC': tasksNC,
        }
        return render(request, 'td/index.html', context=context)

class CreateView(View):
    def post(self, request):
        desc = request.POST.get('desc')
        task = Task(desc=desc)
        task.save()
        return redirect(reverse('td:index'))

class StateView(View):
    def post(self, request, id):
        task = Task.objects.get(id=id)
        task.state = not task.state
        task.save()
        task = {'id': task.id, 'state': task.state}
        return JsonResponse({'task': task})