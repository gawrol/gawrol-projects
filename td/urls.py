from django.urls import path
from td.views import IndexView

app_name = 'td'

urlpatterns = [
    path('', IndexView.as_view(), name="index"),
]