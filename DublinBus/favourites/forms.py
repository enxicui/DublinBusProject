from django import forms
from favourites.models import Post
from django.contrib.auth import get_user_model
User = get_user_model()

# class to create a form
class favouritesForm(forms.ModelForm):
    origin = forms.CharField()
    destination = forms.CharField()


    # class to describe the model
    class Meta:
        model = Post
        fields = ('origin','destination',)


class ContactForm(forms.ModelForm):
    origin = forms.CharField()
    destination = forms.CharField()
