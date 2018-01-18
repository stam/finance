import json
from .generators import DataImport, Balance, balance_model, data_import_model, transaction_model, user_model
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
        self.assertEqual(30200, Balance.get_at_date('2017-12-20', di.user))
        self.assertEqual(28000, Balance.get_at_date('2017-12-21', di.user))

        self.assertEqual(26000, Balance.get_at_date('2017-01-12', di.user))

        # Test after import
        self.assertEqual(22000, Balance.get_at_date('2018-02-05', di.user))

        # Test without imports
        self.assertEqual(None, Balance.get_at_date('2018-02-05', user_model()))


    def test_chart(self):
        di = data_import_model()
        di.calculate_metrics()

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
        # Sum of transaction amount is 8800

        # After all these transaction, the amount is 30000,
        # which means the starting amount = 21200
        balance_model(user=di.user, amount=30000, after_import=di)

        res = self.client.get('/api/balance/chart/', {'start_date': '2017-12-01', 'end_date': '2017-12-31'})
        self.assertEqual(200, res.status_code)
        res = json.loads(res.content.decode())

        # expected_result = [
        #     ('2017-12-01', 21200),
        #     ('2017-12-02', 21200),
        #     ('2017-12-03', 21200),
        #     ('2017-12-04', 21200),
        #     ('2017-12-05', 21200),
        #     ('2017-12-06', 21200),
        #     ('2017-12-07', 21200),
        #     ('2017-12-08', 21200),
        #     ('2017-12-09', 21200),
        #     ('2017-12-10', 21200),
        #     ('2017-12-11', 21200),
        #     ('2017-12-12', 21200),
        #     ('2017-12-13', 21200),
        #     ('2017-12-14', 21200),
        #     ('2017-12-15', 21200),
        #     ('2017-12-16', 21200),
        #     ('2017-12-17', 21200),
        #     ('2017-12-18', 21200),
        #     ('2017-12-19', 21200),
        #     ('2017-12-20', 21200),
        #     ('2017-12-21', 21200),
        #     ('2017-12-22', 21200),
        #     ('2017-12-23', 21200),
        #     ('2017-12-24', 21200),
        #     ('2017-12-25', 21200),
        #     ('2017-12-26', 21200),
        #     ('2017-12-27', 21200),
        #     ('2017-12-28', 21200),
        #     ('2017-12-29', 21200),
        #     ('2017-12-30', 21200),
        #     ('2017-12-31', 21200),
        # ]

        # self.assertEqual(len(res['data']), len(expected_result))

        # for i, b in enumerate(res['data']):
        #     self.assertEqual(b, expected_result[i])

        # test returns balance for given definition

