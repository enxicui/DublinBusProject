from django.test import TestCase


# Create your tests here.
class SignUp(TestCase):
    def test_SignUp_page(self):
        print('******************test_SignUp_page()**********************')
        # send GET request.
        response = self.client.get('/signup/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'signup.html')
