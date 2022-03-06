from django.shortcuts import render
from django.views import View
from td.models import Task

# Create your views here.

class IndexView(View):
    def get(self, request):
        tasks = Task.objects.all()
        context = {'tasks': tasks}
        return render(request, 'td/index.html', context=context)