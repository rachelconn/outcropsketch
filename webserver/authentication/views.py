from django.db import IntegrityError
from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate, login as django_login, logout as django_logout
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response

from common.response import ErrorResponse

User = get_user_model()

@api_view(['POST'])
def register(request):
    # Ensure all required fields are present
    user_params = {}
    required_fields = ['email', 'password', 'first_name', 'last_name', 'instructor', 'student', 'researcher']
    for field in required_fields:
        if field not in request.data:
            return ErrorResponse(f"Required field {field.replace('_', ' ')} missing from request.")
        user_params[field] = request.data[field]

    # Make sure password is at least 8 characters long
    if len(request.data['password']) < 8:
        return ErrorResponse('Password must be at least 8 characters long.')

    # Convert roles to booleans and ensure at least one role is set
    roles = ['instructor', 'student', 'researcher']
    if not any(user_params[role] for role in roles):
        return ErrorResponse('At least one role (student, instructor, or researcher) must be set.')

    # Inform user if email is already in use
    if len(User.objects.filter(email=request.data['email'])) > 0:
        return ErrorResponse('This email is already in use.')

    # Try to create an account and log in to it
    try:
        role = request.data.get('role', 'researcher')
        user = User.objects.create_user(
            **user_params,
        )
        django_login(request, user)
        return Response()
    except Exception as e:
        return ErrorResponse('Unable to create an account. Try again later.')

@api_view(['POST'])
def login(request):
    user = authenticate(
        username=request.data['email'],
        password=request.data['password'],
    )

    if user is None:
        return ErrorResponse('Invalid login credentials. Make sure your email and password are correct.')
    else:
        django_login(request, user)
        return Response()

@api_view(['POST'])
def logout(request):
    django_logout(request)
    return Response()

@api_view(['GET'])
def get_roles(request):
    if request.user.is_anonymous:
        return ErrorResponse('You must be logged in to request roles.')

    return Response({
        'instructor': request.user.instructor,
        'student': request.user.student,
        'researcher': request.user.researcher,
    })
