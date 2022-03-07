from django.urls import path
from td.views import CreateView, IndexView, StateView

app_name = 'td'

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('create/', CreateView.as_view(), name='create'),
    path('<int:id>/state/', StateView.as_view(), name='state'),
]