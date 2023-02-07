from django.db import IntegrityError
from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate, login as django_login, logout as django_logout
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response

User = get_user_model()

@api_view(['POST'])
def register(request):
    # Ensure all required fields are present
    user_params = {}
    required_fields = ['email', 'password', 'first_name', 'last_name', 'instructor', 'student', 'researcher']
    for field in required_fields:
        if field not in request.data:
            return Response(
                data={
                    'reason': f"Required field {field.replace('_', ' ')} missing from request.",
                },
                status=400,
            )
        user_params[field] = request.data[field]

    # Make sure password is at least 8 characters long
    if len(request.data['password']) < 8:
        return Response(
            data={
                'reason': 'Password must be at least 8 characters long.',
            },
            status=400,
        )

    # Convert roles to booleans and ensure at least one role is set
    roles = ['instructor', 'student', 'researcher']
    if not any(user_params[role] for role in roles):
        return Response(
            data={
                'reason': 'At least one role (student, instructor, or researcher) must be set.',
            },
            status=400,
        )

    # Inform user if email is already in use
    if len(User.objects.filter(email=request.data['email'])) > 0:
        return Response(
            data=dict(
                reason='This email is already in use.',
            ),
            status=400,
        )

    # Try to create an account and log in to it
    try:
        role = request.data.get('role', 'researcher')
        user = User.objects.create_user(
            **user_params,
        )
        django_login(request, user)
        return Response()
    except Exception as e:
        return Response(
            data=dict(
                reason='Unable to create an account. Try again later.',
            ),
            status=400,
        )

@api_view(['POST'])
def login(request):
    user = authenticate(
        username=request.data['email'],
        password=request.data['password'],
    )

    if user is None:
        return Response(
            data=dict(
                reason='Invalid login credentials. Make sure your email and password are correct.',
            ),
            status=400,
        )
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
        return Response(
            data=dict(
                reason='You must be logged in to request roles.',
            ),
            status=400,
        )

    return Response({
        'instructor': request.user.instructor,
        'student': request.user.student,
        'researcher': request.user.researcher,
    })
