from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import unittest
from unittest import TestCase


# This is testing part of the getLatLong function, which gets possible routes and displays them

class favTesting(unittest.TestCase):

    def setUp(self):
        self.browser = webdriver.Firefox()

    def tearDown(self):
        self.browser.quit()

    def test_start_journey_planner(self):
        self.browser.get('http://127.0.0.1:8000/favourites/')

        # Check the title of the page
        self.assertIn('Dublin Bus', self.browser.title)
        # header_text = self.browser.find_element_by_id('contact-tab').text
        # print("header text is", header_text)

        loginn = self.browser.find_element_by_id('login')
        loginn.send_keys(Keys.ENTER)

        # Click the button to show more options
        id_username = self.browser.find_element_by_id('id_username')
        id_password = self.browser.find_element_by_id('id_password')
        id_username.send_keys('enxi')
        id_username.send_keys(Keys.ENTER)
        id_password.send_keys('busteam9')
        id_password.send_keys(Keys.ENTER)



        # Type into input and destinatoin, enter
        # inputbox = self.browser.find_element_by_id('origin-input')
        # destbox = self.browser.find_element_by_id('destination-input')





# THese are lines from the examlpe i looked at:

# self.assertEqual(
#     inputbox.get_attribute('placeholder'),
#     'Enter a to-do item'
# )


if __name__ == '__main__':
    unittest.main(warnings='ignore')