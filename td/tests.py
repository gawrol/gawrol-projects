from django.test import TestCase
from django.test import Client

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from td.models import Task

# Create your tests here.

class TaskTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_get_index_page(self):
        response = self.client.get('/td/')
        self.assertEqual(response.status_code, 200)

    def test_anonymous_user_cannot_create_tasks(self):
        response = self.client.post('/td/create/', {'data': 'test'}, content_type='application/json')
        # JSON response contains 'login' key
        self.assertNotContains(response, 'test')
        self.assertContains(response, 'login')

    def test_logged_user_can_create_tasks(self):
        register = self.client.post('/td/register/', {'data': {'user': 'john', 'pass': 'qwer'}}, content_type='application/json')
        self.assertContains(register, 'john')
        # check if user 'john' exists; database is always fresh, so new (first) entry has primary key as value 1
        self.assertEqual(User.objects.get(username='john').pk, 1)
        
        response = self.client.post('/td/create/', {'data': 'test'}, content_type='application/json')
        self.assertNotContains(response, 'login')
        self.assertContains(response, 'test')



