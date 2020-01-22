from django import forms
from map.models import Post

# class to create a form
class MapForm(forms.ModelForm):
    post = forms.CharField()

    # class to describe the model
    class Meta:
        model = Post
        fields = ('post',)
