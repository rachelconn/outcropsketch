from django.urls import path
from authentication.views import register, login, logout

urlpatterns = [
    path('register', register),
    path('login', login),
    path('logout', logout),
]
