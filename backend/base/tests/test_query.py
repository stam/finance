from .generators import data_import_model, query_model, transaction_model
from django.test import TestCase

class Matcher(TestCase):
    def setUp(self):
        self.data_import = data_import_model()

    def test_icontains(self):
        t1 = transaction_model(summary='abc')
        t2 = transaction_model(summary='C')
        t3 = transaction_model(summary='cde')
        transaction_model(summary='efg')

        query = query_model(matcher={
            'column': 'summary',
            'operator': 'icontains',
            'value': 'c',
        })

        match = set([t.id for t in query.matched_transactions()])
        self.assertEqual(match, set([t1.id, t2.id, t3.id]))

    # TODO test own user
