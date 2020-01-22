from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from datetime import datetime
import os
import requests
from django.views.decorators.csrf import csrf_exempt
import json
from django_user_agents.utils import get_user_agent
from django.contrib.auth import get_user_model
User = get_user_model()


def routes(request):
    json_data = open('static/files/routeList.json')
    routeData = json.load(json_data)
    json_data = open('static/files/routesList.json')
    routesList = json.load(json_data)
    user_agent = get_user_agent(request)
    if user_agent.is_mobile:
        return render(request, 'mobile/m_routes.html', {'load': routeData, 'routesList': routesList})
    elif user_agent.is_tablet:
     return render(request, 'mobile/m_routes.html', {'load': routeData, 'routesList': routesList})
    else:
        return render(request, 'routes.html', {'load': routeData, 'routesList': routesList})

@csrf_exempt
def getRoute(request):
    route = request.POST.get("route")
    dirOne = open('static/busroutes/'+route+'_direction1route.json')
    dirTwo = open('static/busroutes/'+route+'_direction2route.json')
    dirOneData = json.load(dirOne)
    dirTwoData = json.load(dirTwo)
    data = json.dumps({
            'dirOneFinal': dirOneData,
            'dirTwoFinal': dirTwoData,
        })
    return HttpResponse(data)



