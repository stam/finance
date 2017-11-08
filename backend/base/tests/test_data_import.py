import os
import shutil
from datetime import date
from django.test import TestCase, Client
from .generators import DataImport, Transaction, User
from django.test.utils import override_settings
from django.conf import settings

TEST_MEDIA_ROOT = os.path.join(os.path.dirname(settings.MEDIA_ROOT), 'test_media')

def get_fixture_path(filename):
    current_dir = os.path.dirname(__file__)
    return os.path.join(current_dir, 'fixtures', filename)

@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class CreatesTransactions(TestCase):
    def setUp(self):
        super().setUp()
        self.user = User(username='testuser', is_active=True, is_superuser=True)
        self.user.set_password('test')
        self.user.save()
        self.client = Client()
        r = self.client.login(username='testuser', password='test')
        self.assertTrue(r)

    def tearDown(self):
        # Delete test media when we're done
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)

    def test_user_scoping(self):
        with open(get_fixture_path('base.csv')) as fh:
            res = self.client.post('/api/data_import/upload/', {'file': fh})

        self.assertEqual(200, res.status_code)

        # Test dataimport created
        di = DataImport.objects.first()
        self.assertEqual(1, DataImport.objects.count())
        self.assertEqual(self.user, di.user)

        # Test transactions created
        transactions = Transaction.objects.all()
        self.assertEqual(4, Transaction.objects.count())
        for t in transactions:
            self.assertEqual(self.user, t.user)

    def test_transaction_data(self):
        with open(get_fixture_path('base.csv')) as fh:
            res = self.client.post('/api/data_import/upload/', {'file': fh})

        self.assertEqual(200, res.status_code)

        expectations = [
            {
                'data_import_id': 1,
                'direction': 'outgoing',
                'date': date(2017, 11, 7),
                'summary': 'Friend',
                'details': 'Naam: Friend Omschrijving: Food IBAN: NL01QWER0123456789',
                'source_account': 'NL01ASDF0123456789',
                'target_account': 'NL01QWER0123456789',
                'type': 'Internetbankieren',
                'amount': -6551,
            },
            {
                'data_import_id': 1,
                'direction': 'outgoing',
                'date': date(2017, 11, 6),
                'summary': 'Grocery Store',
                'details': 'Pasvolgnr:004 06-11-2017 18:13 Transactie:111111 Term:222R2R',
                'source_account': 'NL01ASDF0123456789',
                'target_account': '',
                'type': 'Betaalautomaat',
                'amount': -1054,
            },
            {
                'data_import_id': 1,
                'direction': 'outgoing',
                'date': date(2017, 11, 5),
                'summary': 'Monthly payment',
                'details': 'Naam: Some service Omschrijving: Blaa IBAN: GB01CITI00000000000000 Kenmerk: NL000000AA Machtiging ID: 00000000 Incassant ID: GB01CITI00000000000000 Doorlopende incasso',
                'source_account': 'NL01ASDF0123456789',
                'target_account': 'GB01CITI00000000000000',
                'type': 'Incasso',
                'amount': -400,
            },
            {
                'data_import_id': 1,
                'direction': 'incoming',
                'date': date(2017, 10, 9),
                'summary': 'Salary',
                'details': 'Naam: Company Omschrijving: Salary May IBAN: NL01ZXCV0123456789',
                'source_account': 'NL01ASDF0123456789',
                'target_account': 'NL01ZXCV0123456789',
                'type': 'Overschrijving',
                'amount': 333333,
            }
        ]

        # Test transactions created
        transactions = Transaction.objects.all()
        for i, t in enumerate(transactions):
            for k, v in expectations[i].items():
                with self.subTest('Transaction {}, prop {}'.format(t.id, k)):
                    self.assertEqual(getattr(t, k), v)

    # test_dataimport_metrics
    #
    # test_hash
    #
    # test_overlap
