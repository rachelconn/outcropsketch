from django.urls import path
from authentication.views import register, login, logout, get_roles

urlpatterns = [
    path('register', register),
    path('login', login),
    path('logout', logout),
    path('get_roles', get_roles),
]
