from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.template import loader
import json
from users.models import CustomUser
from django_user_agents.utils import get_user_agent
from django.contrib.auth import get_user_model
User = get_user_model()
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import dateutil.parser

import json
import pickle
import requests
import sqlalchemy
import requests
import time
import numpy
import csv
from csv import DictReader

import pandas as pd


def journeyplan(request):
    # return HttpResponse(render({}, request))
    json_data = open('static/files/stops_info.json')
    stops_data = json.load(json_data)
    user_agent = get_user_agent(request)
    json_routedata = open('static/files/serving_route.json')
    route_data = json.load(json_routedata)

    if user_agent.is_mobile:
        return render(request, 'mobile/m1_journeyplan.html', {'load': stops_data, 'routedata': route_data})
    elif user_agent.is_tablet:
        return render(request, 'mobile/m1_journeyplan.html', {'load': stops_data, 'routedata': route_data})
    else:
        return render(request, 'journeyplan.html', {'load': stops_data, 'routedata': route_data})


@csrf_exempt
def addCO2(request):
    co2 = request.POST.get("co2")
    myUser = request.POST.get('user')
    t = CustomUser.objects.get(username=myUser)
    if t.last_name != "":
        hold = int(t.last_name)+int(co2)
        t.last_name = str(hold)
        try:
            t.save()
            return HttpResponse(status=200)
        except:
            return HttpResponse(status=400)
    else:
        t.last_name = str(co2)
        try:
            t.save()
            return HttpResponse(status =200)
        except:
            return HttpResponse(status =400)


@csrf_exempt
def bus_prediction(request):
    url = 'http://api.openweathermap.org/data/2.5/weather?appid=a8e1877ec087d7a2904f50a41ed61bfa&q=Dublin&units=metric'
    weather_detalis = requests.get(url)
    weatherdata = json.loads(weather_detalis.text)
    hereUrl = request.POST.get("url")
    hereUrl = hereUrl.replace("80085","&")
    routeChosen = request.POST.get("routeChosen")
    routeChosen = int(routeChosen)
    endPoint = request.POST.get("endPoint")
    startingPoint = request.POST.get("startingPoint")

    getroute = request.POST.get("route")
    route = str(getroute)


    getroute = request.POST.get("route")
    route = str(getroute)

    route = request.POST.get("route")
    dayOfWeek = request.POST.get("dayOfWeek")

    rushHour = request.POST.get("rushHour")

    monThursRush = request.POST.get("monThursRush")

    friday = request.POST.get("friday")

    windSpeed =  weatherdata['wind']['speed']
    temp = weatherdata['main']['temp']


    routecsv1 = route+"_direction1route.csv"
    routecsv2 = route+"_direction2route.csv"




    # Get direction by checking routes in csvs
    with open("static/busroutes/"+routecsv1) as f:
        busroute1 = [row["actual_stop_id"] for row in DictReader(f)]
    with open("static/busroutes/"+routecsv2) as f:
        busroute2 = [row["actual_stop_id"] for row in DictReader(f)]
    if startingPoint in busroute1:
        direction = 1
        routeholder = busroute1
    elif startingPoint in busroute2:
        direction = 2
        routeholder = busroute2
    else:
        direction = 1
        startingPoint = busroute1[0]
        routeholder = busroute1
        endstop = busroute1[len(busroute1)-1]


    # make a list of only stops you want
    try:
        first = routeholder.index(startingPoint)
        second = routeholder.index(endPoint)
    except:
        returnData = requests.get(hereUrl)
        returnData = returnData.json()
        parseMe = returnData['Res']['Connections']["Connection"];
        connections = parseMe[routeChosen]['transfers'];
        parsed = parseMe[routeChosen]["Sections"]["Sec"];
        x = 0
        while x < len(parsed):
            if parsed[x]["mode"] == 5:
                if parsed[x]['Dep']['Transport']['name'] == route:
                    a = dateutil.parser.parse(parsed[x]['Dep']['time'])
                    b = dateutil.parser.parse(parsed[x]['Arr']['time'])
                    minutes = b - a
                    minutes = str(minutes).split(":")
                    returnMin = int(minutes[0]) * 60
                    returnMin += int(minutes[1])
                    x+=100000
            x += 1
        big_array = [] #  empty regular list
        big_array.append(returnMin)
        big_np_array = numpy.array(big_array)
        return HttpResponse(big_np_array)

    sectionlist = [routeholder[x]+":"+ routeholder[x+1] for x in range(first, second)]
    # open model dictionary, filter to only stops that you want
    with open("static/pickle/"+route+"_"+str(direction)+"_pickle", "rb") as handle:
        full_modelreturn = pickle.load(handle)

    returndict={}

    for key in sectionlist:
        if key in full_modelreturn:
            returndict[key] = full_modelreturn[key]
        else:
            continue

    # # put together input dictionary

    testinput = {'direction': direction, 'dayOfWeek': 6, 'rushHour': rushHour, 'monToThurRushHour': monThursRush, 'friday': friday, 'windSpeed': windSpeed, 'temp': temp}
    datainput = pd.DataFrame([testinput])


    returnvalue={}
    # to count total journey time
    totaljourney=0
    # get all predictions from dictionary of models
    for key,value in returndict.items():
        thismodel=returndict[key]
        thisprediction=thismodel.predict(datainput)
        returnvalue[key]= thisprediction
        totaljourney+=thisprediction
    myValToReturn = totaljourney/60
    return HttpResponse(myValToReturn)