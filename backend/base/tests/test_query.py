import json
from binder.json import jsonloads
from django.test import TestCase, Client
from .generators import data_import_model, query_model, query_data, transaction_model, category_model, user_model, User

class Matcher(TestCase):
    def setUp(self):
        self.user = user_model()
        self.data_import = data_import_model()

    def test_icontains(self):
        t1 = transaction_model(summary='abc', user=self.user)
        t2 = transaction_model(summary='C', user=self.user)
        t3 = transaction_model(summary='cde', user=self.user)
        transaction_model(summary='efg', user=self.user)

        query = query_model(user=self.user, matcher={
            'column': 'summary',
            'operator': 'icontains',
            'value': 'c',
        })

        match = set([t.id for t in query.matched_transactions()])
        self.assertEqual(match, set([t1.id, t2.id, t3.id]))

    def test_filters_on_user(self):
        t_own = transaction_model(summary='bla', user=self.user)
        transaction_model(summary='bla')

        query = query_model(user=self.user, matcher={
            'column': 'summary',
            'operator': 'is',
            'value': 'bla',
        })

        match = set([t.id for t in query.matched_transactions()])
        self.assertEqual(match, set([t_own.id]))


class RunAfterStore(TestCase):
    def setUp(self):
        super().setUp()
        self.user = User(username='testuser', is_active=True, is_superuser=True)
        self.user.set_password('test')
        self.user.save()
        self.client = Client()
        r = self.client.login(username='testuser', password='test')
        self.assertTrue(r)

        self.data_import = data_import_model(user=self.user)

        self.t1 = transaction_model(amount=69, user=self.user)
        self.t2 = transaction_model(amount=70, user=self.user)
        self.t3 = transaction_model(amount=71, user=self.user)

    def test_post(self):
        category = category_model()

        data = query_data()
        data['category'] = category.id
        data['matcher'] = {
            'column': 'amount',
            'operator': 'gte',
            'value': 70
        }

        res = self.client.post('/api/query/', data=json.dumps(data), content_type='application/json')
        self.assertEqual(200, res.status_code)
        res = jsonloads(res.content)

        self.t1.refresh_from_db()
        self.t2.refresh_from_db()
        self.t3.refresh_from_db()

        # t1 shouldn't match as !69 gte 70
        self.assertEqual(None, self.t1.category_id)
        self.assertEqual(None, self.t1.query_id)

        self.assertEqual(category.id, self.t2.category_id)
        self.assertEqual(res['id'], self.t2.query_id)

        self.assertEqual(category.id, self.t3.category_id)
        self.assertEqual(res['id'], self.t3.query_id)
