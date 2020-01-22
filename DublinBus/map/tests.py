from django.test import TestCase

# Create your tests here.
class getmapTest(TestCase):
    def test_map_page(self):
        print('******************test_map_page()**********************')
        # send GET request.
        response = self.client.get('/map/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'map.html')
#
#
class postmapTest(TestCase):
    def postfavTest(self):
        print('******************test_map_page()**********************')
        # send GET request.
        response = self.client.post('/map/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'map.html')

#
# class getrouteTest(TestCase):
#     def test_home_page(self):
#         print('******************test_map_page()**********************')
#         # send GET request.
#         response = self.client.post('/map/')
#         print('Response status code : ' + str(response.url))
#         self.assertEqual(response.url, 200)
#         self.assertTemplateUsed(response, 'map.html')