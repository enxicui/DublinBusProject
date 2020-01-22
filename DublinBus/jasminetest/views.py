from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader


# Create your views here.

def jasminetest(request):
    # return HttpResponse(render({}, request))
    return render(request, "SpecRunner.html")
