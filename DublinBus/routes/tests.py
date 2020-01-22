from django.test import TestCase



class routes(TestCase):
    def test_route_page(self):
        print('******************test_routes_page()**********************')
        # send GET request.
        response = self.client.get('/routes/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'routes.html')