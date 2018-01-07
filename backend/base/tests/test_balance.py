import json
from binder.json import jsonloads
from django.test import TestCase, Client
from .generators import DataImport, balance_model
from .test_data_import import get_fixture_path, ViewTestCase

class Recalculate(ViewTestCase):
    def test_work_for_later_transactions(self):
        with open(get_fixture_path('base.csv')) as fh:
            res = self.client.post('/api/data_import/upload/', {'file': fh})

        self.assertEqual(200, res.status_code)

        di = DataImport.objects.first()
        old_balance = balance_model(after_import=di, user=di.user)

        self.assertEqual(1337, old_balance.amount)

        with open(get_fixture_path('later.csv')) as fh:
            res = self.client.post('/api/data_import/upload/', {'file': fh})

        self.assertEqual(200, res.status_code)
        new_di = DataImport.objects.order_by('-last_transaction_date').first()

        t_values = [222222, -39999, -690, -400]  # sum = 181133

        for i, t in enumerate(new_di.transactions.all()):
            self.assertEqual(t_values[i], t.amount)

        # Check there is a new balance
        new_balance = new_di.resulting_balance.first().amount
        self.assertEqual(new_balance, sum(t_values) + old_balance.amount)
        self.assertEqual(new_balance, 182470)
