from django.test import TestCase, Client
client=Client()

# class YourTestClass(TestCase):
#     @classmethod
#     def test_favourites(self):
#         print("----Testing favourites views.py----")
#         response = self.client.get('favourites.html')
#         print("Status code: " + str(response.status_code))
#         self.assertEqual(response.status_code, 200)

#     def test_favourites_mobile(self):
#         print("---- Testing mobile favourite views.py ----")
#         response = self.client.get('mobile/m_favourites.html')
#         print("Status code: " + str(response.status_code))
#         self.assertEqual(response.status_code, 200)


# Create your tests here.


from django.test import TestCase

class getfavTest(TestCase):
    def test_favourite_page(self):
        print('******************test_favourite_page()**********************')
        # send GET request.
        response = self.client.get('/favourites/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'favourites.html')

class postfavTest(TestCase):
    def post_favourite_Test(self):
        print('******************test_favourite_page()**********************')
        # send GET request.
        response = self.client.post('/favourites/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'favourites.html')