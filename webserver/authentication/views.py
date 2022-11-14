from django.db import IntegrityError
from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate, login as django_login, logout as django_logout
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response

User = get_user_model()

@api_view(['POST'])
def register(request):
    # Inform user if email is already in use
    if len(User.objects.filter(email=request.data['email'])) > 0:
        return Response(
            data={
                'reason': 'This email is already in use.',
            },
            status=400,
        )

    # Try to create an account
    try:
        User.objects.create_user(
            email=request.data['email'],
            # TODO: hash password
            password=request.data['password'],
            instructor=False,
            admin=False,
        )
    except:
        return Response(
            data={
                'reason': 'Unable to create an account. Try again later.',
            },
            status=400,
        )

    return Response()

@api_view(['POST'])
def login(request):
    user = authenticate(
        username=request.data['email'],
        password=request.data['password'],
    )

    if user is None:
        return Response(
            data={
                'reason': 'Invalid login credentials. Make sure your email and password are correct.',
            },
            status=400,
        )
    else:
        django_login(request, user)
        return Response()

@api_view(['POST'])
def logout(request):
    django_logout(request)
    return Response()
