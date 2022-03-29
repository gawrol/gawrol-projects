from django.test import RequestFactory, TestCase
from django.test import Client

from django.contrib.auth.models import User
from django.urls import reverse
from td.models import Task

# Create your tests here.

username = 'adrian'
password = 'qwer'

errorEmpty = '1 or more characters'
errorUserExists = 'user with suplied username already exists'
errorCredentials = 'wrong username or password'
errorOwner = 'not owner of a task'
errorTaskExists = 'task desc already exists for current user'

class TaskTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def register(self, username=username, password=password):
        return self.client.post(reverse('td:my_register'), {'data': {'user': username, 'pass': password}}, content_type='application/json')

    def create(self, desc='test'):
        return self.client.post(reverse('td:create'), {'data': desc}, content_type='application/json')

    def test_get_index_page(self):
        response = self.client.get(reverse('td:index'))
        self.assertEqual(response.status_code, 200)

    def test_anonymous_user_cannot_view_tasks(self):
        response = self.client.get(reverse('td:read'))
        self.assertJSONEqual(response.content, {'tasks': []})

    def test_logged_user_can_view_its_tasks(self):
        self.register()

        response = self.client.get(reverse('td:read'))
        self.assertJSONEqual(response.content, {'tasks': []})

        response = self.create()
        self.assertContains(response, 'test')

    def test_anonymous_user_cannot_create_tasks(self):
        response = self.create()
        self.assertNotContains(response, 'test')
        self.assertJSONEqual(response.content, {'login': reverse('td:my_login')})

    def test_logged_user_can_create_tasks(self):
        register = self.register()
        self.assertContains(register, username)
        # check if username exists; database is always fresh, so new (first) entry has primary key as value 1
        # self.assertEqual(User.objects.get(username=self.username).pk, 1)

        response = self.create()
        self.assertNotContains(response, 'login')
        self.assertContains(response, 'test')
    
    def test_user_cannot_create_task_with_empty_description(self):
        self.register()

        response = self.create('')
        self.assertJSONEqual(response.content, {'error': errorEmpty})

    def test_user_cannot_create_task_with_same_description(self):
        self.register()

        response = self.create()
        self.assertContains(response, 'test')

        response = self.create()
        self.assertJSONEqual(response.content, {'error': errorTaskExists})

    def test_user_can_update_description_of_its_task(self):
        self.register()

        response = self.create()
        self.assertContains(response, 'test')

        response = self.client.patch(reverse('td:update'), {'dataText': 'asdf', 'dataId': 1}, content_type='application/json')
        self.assertContains(response, 'asdf')
        self.assertJSONEqual(response.content, {'task': {
            'id': 1, 
            'desc': 'asdf',
        }})

    def test_user_cannot_update_description_of_someones_else_task(self):
        self.register()

        response = self.create()
        self.assertContains(response, 'test')

        logout = self.client.get(reverse('td:my_logout'))
        self.assertJSONEqual(logout.content, {'redirect': reverse('td:index')})

        self.register('johny')
        response = self.client.patch(reverse('td:update'), {'dataText': 'asdf', 'dataId': 1}, content_type='application/json')
        self.assertContains(response, 'error')
        self.assertJSONEqual(response.content, {'error': errorOwner})

    def test_user_can_delete_its_task(self):
        self.register()

        response = self.create()
        self.assertContains(response, 'test')

        response = self.client.delete(reverse('td:delete'), {'dataId': 1}, content_type='application/json')    
        self.assertContains(response, 1)
        self.assertJSONEqual(response.content, {'task': {'id': 1}})

    def test_user_can_change_state_of_its_task(self):
        self.register()

        response = self.create()
        self.assertContains(response, 'test')
        # new task has its default state as 'false'
        self.assertContains(response, 'false')

        response = self.client.patch(reverse('td:state'), {'dataId': 1}, content_type='application/json')
        self.assertContains(response, 1)
        self.assertContains(response, 'true')
        # 'true' when assertContains, True when assertJSONEqual (because of 'raw' attribute?)
        self.assertJSONEqual(response.content, {'task': {'id': 1, 'state': True}})

        # change again from True to False
        response = self.client.patch(reverse('td:state'), {'dataId': 1}, content_type='application/json')
        self.assertContains(response, 'false')
        self.assertJSONEqual(response.content, {'task': {'id': 1, 'state': False}})

    def test_person_can_view_register_page(self):
        response = self.client.get(reverse('td:my_register'))
        self.assertEqual(response.status_code, 200)

    def test_person_can_register_with_username_and_password(self):
        response = self.client.post(reverse('td:my_register'), {'data': {'user': 'mary', 'pass': 'qwer'}}, content_type='application/json')
        self.assertContains(response, 'mary')
        self.assertJSONEqual(response.content, {'redirect': reverse('td:index'), 'username': 'mary'})
        
    def test_person_cannot_register_with_empty_username_or_password(self):
        response = self.register(username='')
        self.assertContains(response, 'error')
        self.assertJSONEqual(response.content, {'error': errorEmpty})

        response = self.register(password='')
        self.assertContains(response, 'error')
        self.assertJSONEqual(response.content, {'error': errorEmpty})

    def test_person_cannot_register_with_the_same_username(self):
        response = self.register(username='exists')
        self.assertContains(response, 'exists')
        self.assertJSONEqual(response.content, {'redirect': reverse('td:index'), 'username': 'exists'})

        logout = self.client.get(reverse('td:my_logout'))
        self.assertJSONEqual(logout.content, {'redirect': reverse('td:index')})

        response = self.register(username='exists')
        self.assertContains(response, 'error')
        self.assertJSONEqual(response.content, {'error': errorUserExists})

    def test_person_can_view_login_page(self):
        response = self.client.get(reverse('td:my_login'))
        self.assertEqual(response.status_code, 200)

    def test_person_can_login_with_username_and_password(self):
        self.register()

        logout = self.client.get(reverse('td:my_logout'))
        self.assertJSONEqual(logout.content, {'redirect': reverse('td:index')})

        response = self.client.post(reverse('td:my_login'), {'data': {'user': username, 'pass': password}}, content_type='application/json')
        self.assertContains(response, username)
        self.assertJSONEqual(response.content, {'redirect': reverse('td:index'), 'username': username})

    def test_person_cannot_login_with_wrong_credentials(self):
        self.register()

        logout = self.client.get(reverse('td:my_logout'))
        self.assertJSONEqual(logout.content, {'redirect': reverse('td:index')})

        response = self.client.post(reverse('td:my_login'), {'data': {'user': 'wrongUsername', 'pass': 'wrongPassword'}}, content_type='application/json')
        self.assertContains(response, 'error')
        self.assertJSONEqual(response.content, {'error': errorCredentials})



