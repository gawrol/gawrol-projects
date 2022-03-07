from django.urls import path
from td.views import IndexView, ReadView, CreateView, UpdateView, StateView

app_name = 'td'

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('read/', ReadView.as_view(), name='read'),
    path('create/', CreateView.as_view(), name='create'),
    path('<int:id>/update/', UpdateView.as_view(), name='update'),
    path('<int:id>/state/', StateView.as_view(), name='state'),
]