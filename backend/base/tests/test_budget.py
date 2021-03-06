import json
from .generators import DataImport, Category, Balance, balance_model, budget_model, data_import_model, transaction_model, user_model
from .test_data_import import get_fixture_path, ViewTestCase

class Budget(ViewTestCase):
    def test_get_budget(self):
        di = data_import_model(user=self.user)
        b1 = budget_model(user=di.user, name="Shop", amount=3000)
        b2 = budget_model(user=di.user, name="Travel", amount=2000)

        c1 = Category.objects.filter(name="Groceries").first()
        c1.budget = b1
        c1.save()
        c2 = Category.objects.filter(name="Shopping").first()
        c2.budget = b1
        c2.save()

        c3 = Category.objects.filter(name="Transport").first()
        c3.budget = b2
        c3.save()

        # Groceries spend A and B
        # Transport spend C and receive D
        transaction_model(user=di.user, category=c1, data_import=di, date='2017-12-10', amount=-2000)
        transaction_model(user=di.user, category=c2, data_import=di, date='2017-12-11', amount=-400)
        # No cat for E
        transaction_model(user=di.user, category=c3, data_import=di, date='2017-12-11', amount=-600)
        transaction_model(user=di.user, category=c3, data_import=di, date='2017-12-20', amount=-200)
        transaction_model(user=di.user, data_import=di, date='2017-12-20', amount=500)


        res = self.client.get('/api/budget/summary/', {'start_date': '2017-12-01', 'end_date': '2017-12-31'})
        self.assertEqual(200, res.status_code)

        res = json.loads(res.content.decode())

        expected_response = [
            {'name': 'Shop', 'total': 3000, 'current': 2000 + 400},
            {'name': 'Travel', 'total': 2000, 'current': 600 + 200},
            {'name': 'Uncategorised', 'total': 0, 'current': -500},
        ]
        self.assertListEqual(expected_response, res['data'])

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


    def test_calculate_at_date(self):
        di = data_import_model()
        transaction_model(user=di.user, data_import=di, date='2017-12-10', amount=-2000)
        transaction_model(user=di.user, data_import=di, date='2017-12-11', amount=-400)
        transaction_model(user=di.user, data_import=di, date='2017-12-11', amount=-600)
        transaction_model(user=di.user, data_import=di, date='2017-12-20', amount=-200)
        di.calculate_metrics()
        balance_model(user=di.user, amount=30000, after_import=di)

        di2 = data_import_model(user=di.user)
        transaction_model(user=di.user, data_import=di2, date='2017-12-20', amount=-2000)
        transaction_model(user=di.user, data_import=di2, date='2018-01-10', amount=-2000)
        transaction_model(user=di.user, data_import=di2, date='2018-01-15', amount=-2000)
        transaction_model(user=di.user, data_import=di2, date='2018-01-20', amount=-2000)
        di2.calculate_metrics()
        balance_model(user=di.user, amount=22000, after_import=di2)

        # Test before import
        self.assertEqual(31200, Balance.get_at_date('2017-12-11', di.user))

        # Test on overlapping date
        # Note: the get_at_date is at the start of the day!
        # The balance after the di.transactions is after the -200 one on 2017-12-20
        # If we query the balance at that date, we expect the result before that transaction happened
        # So we expect the balance at the start of 2017-12-20 to be 30000 - -200
        self.assertEqual(30200, Balance.get_at_date('2017-12-20', di.user))
        self.assertEqual(28000, Balance.get_at_date('2017-12-21', di.user))

        self.assertEqual(26000, Balance.get_at_date('2018-01-12', di.user))

        # Test after import
        self.assertEqual(22000, Balance.get_at_date('2018-02-05', di.user))

        # Test without imports
        self.assertEqual(None, Balance.get_at_date('2018-02-05', user_model()))


    def test_chart(self):
        di = data_import_model(user=self.user)

        # Create date import w/ transactions that span multiple months
        transaction_model(user=di.user, data_import=di, date='2017-12-10', amount=-2000)
        transaction_model(user=di.user, data_import=di, date='2017-12-11', amount=-400)
        transaction_model(user=di.user, data_import=di, date='2017-12-11', amount=-600)
        transaction_model(user=di.user, data_import=di, date='2017-12-20', amount=-200)
        transaction_model(user=di.user, data_import=di, date='2017-12-28', amount=20000)
        transaction_model(user=di.user, data_import=di, date='2018-01-05', amount=-2000)
        transaction_model(user=di.user, data_import=di, date='2018-01-10', amount=-2000)
        transaction_model(user=di.user, data_import=di, date='2018-01-15', amount=-2000)
        transaction_model(user=di.user, data_import=di, date='2018-01-20', amount=-2000)
        di.calculate_metrics()
        # Sum of transaction amount is 8800

        # After all these transaction, the amount is 30000,
        # which means the starting amount = 21200
        balance_model(user=di.user, amount=30000, after_import=di)

        res = self.client.get('/api/balance/chart/', {'start_date': '2017-12-01', 'end_date': '2017-12-31'})
        self.assertEqual(200, res.status_code)
        res = json.loads(res.content.decode())

        expected_result = [
            ['2017-12-01', 21200],
            ['2017-12-02', 21200],
            ['2017-12-03', 21200],
            ['2017-12-04', 21200],
            ['2017-12-05', 21200],
            ['2017-12-06', 21200],
            ['2017-12-07', 21200],
            ['2017-12-08', 21200],
            ['2017-12-09', 21200],
            ['2017-12-10', 21200],
            ['2017-12-11', 19200],
            ['2017-12-12', 18200],
            ['2017-12-13', 18200],
            ['2017-12-14', 18200],
            ['2017-12-15', 18200],
            ['2017-12-16', 18200],
            ['2017-12-17', 18200],
            ['2017-12-18', 18200],
            ['2017-12-19', 18200],
            ['2017-12-20', 18200],
            ['2017-12-21', 18000],
            ['2017-12-22', 18000],
            ['2017-12-23', 18000],
            ['2017-12-24', 18000],
            ['2017-12-25', 18000],
            ['2017-12-26', 18000],
            ['2017-12-27', 18000],
            ['2017-12-28', 18000],
            ['2017-12-29', 38000],
            ['2017-12-30', 38000],
            ['2017-12-31', 38000],
        ]

        self.assertEqual(len(res['data']), len(expected_result))

        for i, b in enumerate(res['data']):
            self.assertEqual(b, expected_result[i])
