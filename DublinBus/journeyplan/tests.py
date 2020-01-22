from django.test import TestCase

# Create your tests here.
class journeyplanTest(TestCase):
    def test_journeyplan_page(self):
        print('******************test_journeyplan_page()**********************')
        # send GET request.
        response = self.client.get('/journeyplan/')
        print('Response status code : ' + str(response.status_code))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'journeyplan.html')