from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from django_user_agents.utils import get_user_agent
from django.contrib.auth import get_user_model
User = get_user_model()
from django.views.decorators.csrf import csrf_exempt

from dublinbus.settings import TEMPLATES
from django.views.generic import TemplateView

from map.forms import MapForm
import json


class map_view(TemplateView):
    template_name = 'map.html'
    
    # get method
    def get(self, request):
        form = MapForm()
        json_data = open('static/files/stops_info.json')
        stops_data = json.load(json_data)
        user_agent = get_user_agent(request)
        json_routedata = open('static/files/serving_route.json')
        route_data = json.load(json_routedata)
        json_tourismData = open('static/files/tourism.json')
        tourism_data = json.load(json_tourismData)
        if user_agent.is_mobile:
            return render(request, 'mobile/m_map.html', {'form':form, 'load': stops_data, 'routedata': route_data, 'tourismData': tourism_data})
        elif user_agent.is_tablet:
            return render(request, 'mobile/m_map.html', {'form':form, 'load': stops_data, 'routedata': route_data, 'tourismData': tourism_data})
        else:
            return render(request, 'map.html', {'form':form, 'load': stops_data, 'routedata': route_data, 'tourismData': tourism_data})


    # post method, which saves to the model
    def post(self, request):
        form = MapForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            text = form.cleaned_data['post']
            post.save()
            # initialise another blank form
            form = MapForm()
            # return redirect('/home/')
        # render the form and the text
        args = {'form': form, 'text':text}
        return render(request, self.template_name, args)



