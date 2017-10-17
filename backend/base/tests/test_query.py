from .generators import data_import_model, query_model, transaction_model, user_model
from django.test import TestCase

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

    # TODO test own user
