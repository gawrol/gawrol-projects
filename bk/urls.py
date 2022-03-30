from django.urls import path
from bk.views import CreateView, DeleteView, IndexView, ReadView

app_name = 'bk'

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('read/', ReadView.as_view(), name='read'),
    path('create/', CreateView.as_view(), name='create'),
    # path('update/', UpdateView.as_view(), name='update'),
    path('delete/', DeleteView.as_view(), name='delete'),
    # path('register/', RegisterView.as_view(), name='my_register'),
    # path('login/', LoginView.as_view(), name='my_login'),
    # path('logout/', LogoutView.as_view(), name='my_logout'),
]