from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import unittest
from unittest import TestCase


# This is testing part of the getLatLong function, which gets possible routes and displays them

class htmlTesting(unittest.TestCase):

    def setUp(self):
        self.browser = webdriver.Firefox()

    def tearDown(self):
        self.browser.quit()

    def test_start_journey_planner(self):
        self.browser.get('http://127.0.0.1:8000/routes')

        # Check the title of the page
        self.assertIn('Dublin Bus', self.browser.title)
        # header_text = self.browser.find_element_by_id('options').text
        # print("header text is", header_text)
        # self.assertIn('Search', header_text)




        # Type into input and destinatoin, enter
        inputbox = self.browser.find_element_by_id('busSearch')
        inputbox.send_keys('150')
        inputbox.send_keys(Keys.ENTER)

        # Click the button to show more 150
        showButton = self.browser.find_element_by_id('searchButton')
        showButton.send_keys(Keys.ENTER)





if __name__ == '__main__':
    unittest.main(warnings='ignore')