from django.shortcuts import render

def index(request):
    # TODO: context?
    return render(request, 'index.html')
