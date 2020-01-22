from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from django.views.decorators.csrf import csrf_exempt
from .forms import CustomUserCreationForm
from users.models import CustomUser
from django.http import HttpResponse
import json
from django_user_agents.utils import get_user_agent
from django.contrib.auth import get_user_model
User = get_user_model()

class SignUp(CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'signup.html'


@csrf_exempt
def addFav(request):
    start = request.POST.get('start')
    end = request.POST.get('end')
    myUser = request.POST.get('user')
    t = CustomUser.objects.get(username=myUser)
    if len(t.favourites) == 0:
        t.favourites = start + ":" + end
    else:
        t.favourites = t.favourites + "*" + start + ":" + end
    try:
        t.save()
        return HttpResponse(status=200)
    except Exception:
        return HttpResponse(status=400)

@csrf_exempt
def addLocation(request):
    location = request.POST.get('location')
    points = request.POST.get("points")
    myUser = request.POST.get('user')
    t = CustomUser.objects.get(username=myUser)
    if len(t.places_visited) == 0:
        t.places_visited = location
    else:
        t.places_visited = t.places_visited + "*" + location
    t.points = t.points + 10
    try:
        t.save()
        return HttpResponse(status=200)
    except Exception:
        return HttpResponse(status=400)

