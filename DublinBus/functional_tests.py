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
        self.browser.get('http://127.0.0.1:8000/journeyplan')

        # Check the title of the page
        self.assertIn('Dublin Bus', self.browser.title)
        header_text = self.browser.find_element_by_id('options').text
        print("header text is", header_text)
        self.assertIn('Search', header_text)

        # Click the button to show more options
        showOptionsButton = self.browser.find_element_by_id('optionsButton')
        showOptionsButton.send_keys(Keys.ENTER)

        # Type into input and destinatoin, enter
        inputbox = self.browser.find_element_by_id('origin-input')
        destbox = self.browser.find_element_by_id('destination-input')
        inputbox.send_keys('Bray, County Wicklow, Ireland')
        inputbox.send_keys(Keys.ENTER)
        destbox.send_keys('Howth, Dublin, Ireland')
        destbox.send_keys(Keys.ENTER)

        # Enter default time
        nextButton = self.browser.find_element_by_id('directionsButton')
        nextButton.send_keys(Keys.ENTER)

        # directionsButton2 = self.browser.find_element_by_id('directionsButton2')
        # directionsButton2.send_keys(Keys.ENTER)

        # Type into input and destinatoin, enter
        timebox = self.browser.find_element_by_id('timepicker1')
        datebox = self.browser.find_element_by_id('dateField')
        timebox.send_keys('09:00')
        timebox.send_keys(Keys.ENTER)
        datebox.send_keys('08/16/2019')
        datebox.send_keys(Keys.ENTER)

        # check the text 'Possible Routes' is displayed
        this_text = self.browser.find_element_by_id('options').text
        self.assertIn('Possible Routes', this_text)


# THese are lines from the examlpe i looked at:

# self.assertEqual(
#     inputbox.get_attribute('placeholder'),
#     'Enter a to-do item'
# )

# # She types "Buy peacock feathers" into a text box (Edith's hobby
# # is tying fly-fishing lures)
# inputbox.send_keys('Buy peacock feathers')

# table = self.browser.find_element_by_id('id_list_table')
# rows = table.find_elements_by_tag_name('tr')
# self.assertTrue(
#     any(row.text == '1: Buy peacock feathers' for row in rows)
# )

# # There is still a text box inviting her to add another item. She
# # enters "Use peacock feathers to make a fly" (Edith is very
# # methodical)
# self.fail('Finish the test!')


if __name__ == '_main_':
    unittest.main(warnings='ignore')