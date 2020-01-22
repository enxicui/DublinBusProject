from django.test import TestCase

# Create your tests here.
class ViewTest(TestCase):
    def test_more_page(self):
        print('******************test_more_page()**********************')
        # send GET request.
        response = self.client.get('/more/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'more.html')
