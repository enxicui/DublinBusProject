from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import json
from django.urls import path
from django.views.generic import TemplateView
from django_user_agents.utils import get_user_agent
from favourites.forms import favouritesForm
from django.views.generic.edit import FormView
from favourites.forms import ContactForm
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.contrib.auth import get_user_model
# from favourites.models import UsersCustomuser
from django.views.decorators.csrf import csrf_exempt

from users.models import CustomUser

User = get_user_model()
# Create your views here.

# def favourites(request):
#     # return HttpResponse(render({}, request))
#     json_data = open('static/files/stops_info.json')
#     stops_data = json.load(json_data)
#     user_agent = get_user_agent(request)
#     if user_agent.is_mobile:
#         return render(request, 'mobile/m_favourites.html', {'load': stops_data})
#     elif user_agent.is_tablet:
#         return render(request, 'mobile/m_favourites.html', {'load': stops_data})
#     else:
#         return render(request, 'favourites.html', {'load': stops_data})


# def favourites_view(request):
#     if request.method == 'POST': # If the form has been submitted...
#         form = favouritesForm(request.POST) # A form bound to the POST data
#         print("form is favouritesform")
#         if form.is_valid(): # All validation rules pass
#             # Process the data in form.cleaned_data
#             # ...

#             print(form.cleaned_data['origin-input'])
#             print("form is")
#             return HttpResponseRedirect('./mobile/m1_journeyplan.html/') # Redirect after POST
#     else:
#         form = favouritesForm() # An unbound form

#     return render_to_response('./mobile/m_favourites.html', {
#         'form': form,
#     })




    
class favourites_view(TemplateView):
    template_name = 'mobile/m_favourites.html'
    # get method
    def get(self, request):
        print("request.Post: ", request.POST)
        # initialise a form
        print(request.POST.get("origin", ""))
        form = favouritesForm
        json_data = open('static/files/stops_info.json')
        stops_data = json.load(json_data)
        user_agent = get_user_agent(request)
        args = {'load': stops_data, 'form': form}
        print("user agent is", user_agent)
        print("request is", request)
        if user_agent.is_mobile:
            return render(request, 'mobile/m_favourites.html', args)
        elif user_agent.is_tablet:
            return render(request, 'mobile/m_favourites.html', args)
        else:
            return render(request, 'favourites.html', args)
            
    # post method, which saves to the model
    def post(self, request):
        print("request.Post: ", request.POST)
        form = favouritesForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            # text = form.cleaned_data['origin']
            post.save()
            # initialise another blank form
        form = favouritesForm(request.POST)
            # return redirect('/home/')
        # render the form and the text
        # args = {'form': form, 'text':text}
        # return render(request, self.template_name, args)
        user_agent = get_user_agent(request)
        args = {'form': form}
        if user_agent.is_mobile:
            return render(request, 'mobile/m_favourites.html', args)
        elif user_agent.is_tablet:
            return render(request, 'mobile/m_favourites.html', args)
        else:
            return render(request, 'favourites.html', args)

    @csrf_exempt
    def delete_fav(request):
        user_info = request.POST.get('user')
        startLoc = request.POST.get('start')
        endLoc = request.POST.get('end')
        user = CustomUser.objects.get(username=user_info)
        print("RAW IS: " + user.favourites)
        favourites_items = user.favourites.split("*")
        new_item = ""
        for item in favourites_items:
            print("Delete: " + startLoc+":" +endLoc + " Current is: " + item)
            if startLoc+":"+endLoc != item:
                if new_item != "":
                    new_item += '*' + item
                else:
                    new_item += item
            else:
                print("DELETING")
        user.favourites = new_item
        try:
            user.save()
            return HttpResponse(status=200)
        except Exception:
            return HttpResponse(status=400)
