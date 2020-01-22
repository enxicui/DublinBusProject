
from django.conf import settings
class MobileTemplatesMiddleware(object):
        """Determines which set of templates to use for a mobile site"""

        def process_request(self, request):
            # sets are used here, you can use other logic if you have an older version of Python
            MOBILE_SUBDOMAINS = set(['m', 'mobile'])
            domain = set(request.META.get('HTTP_HOST', '').split('.'))
            print(request.flavour)
            if request.flavour=='mobile':
                TEMP_DIR = settings.MOBILE_TEMPLATE_DIRS
            else:
                TEMP_DIR = settings.DESKTOP_TEMPLATE_DIRS