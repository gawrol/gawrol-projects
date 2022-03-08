from django.urls import path
from td.views import DeleteView, IndexView, LoginView, LogoutView, ReadView, CreateView, RegisterView, UpdateView, StateView

app_name = 'td'

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('read/', ReadView.as_view(), name='read'),
    path('create/', CreateView.as_view(), name='create'),
    path('<int:id>/update/', UpdateView.as_view(), name='update'),
    path('<int:id>/delete/', DeleteView.as_view(), name='delete'),
    path('<int:id>/state/', StateView.as_view(), name='state'),
    path('register/', RegisterView.as_view(), name='my_register'),
    path('login/', LoginView.as_view(), name='my_login'),
    path('logout/', LogoutView.as_view(), name='my_logout'),
]