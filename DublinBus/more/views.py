from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
# Create your views here.
from django_user_agents.utils import get_user_agent
from django.contrib.auth import get_user_model
User = get_user_model()

def more(request):
    # return HttpResponse(render({}, request))
    user_agent = get_user_agent(request)
    if user_agent.is_mobile:
        return render(request, 'mobile/m_more.html', )
    elif user_agent.is_tablet:
        return render(request, 'mobile/m_more.html', )
    else:
        return render(request, 'more.html', )


