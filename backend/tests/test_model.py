from app import app, db
from src.models import DataImport, Transaction
from datetime import datetime
import unittest


def parse_date(d):
    return datetime.strptime(d, '%Y-%m-%d').date()


def check_range(imports, d):
    date = parse_date(d)
    r = DataImport.create_range(imports)
    return DataImport.is_in_range(r, date)


class TransactionExists(unittest.TestCase):
    def setUp(self):
        """
        Creates a new database for the unit test to use
        """
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
        db.create_all()

    def tearDown(self):
        """
        Ensures that the database is emptied for next unit test
        """
        db.drop_all()

    def test_inside_range(self):
        t = Transaction()
        inside_range = True

        self.assertEqual(True, DataImport.transaction_exists(inside_range, t))

    def test_outside_range(self):
        t = Transaction()
        outside_range = False

        # And should not query
        self.assertEqual(False, DataImport.transaction_exists(outside_range, t))

    def test_edge_exists(self):
        t = Transaction({'uid': 'foo'})
        db.session.add(t)
        db.session.commit()

        t2 = Transaction({'uid': 'foo'})
        self.assertEqual(True, DataImport.transaction_exists('edge', t2))

    def test_edge_not_exists(self):
        t = Transaction({'uid': 'foo'})
        db.session.add(t)
        db.session.commit()

        t2 = Transaction({'uid': 'bar'})
        self.assertEqual(False, DataImport.transaction_exists('edge', t2))


class ImportDataRange(unittest.TestCase):
    def setUp(self):
        """
        Creates a new database for the unit test to use
        """
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
        db.create_all()

    def tearDown(self):
        """
        Ensures that the database is emptied for next unit test
        """
        db.drop_all()

    def test_after(self):
        d1 = DataImport({
            'first_transaction_date': parse_date('2017-01-10'),
            'last_transaction_date': parse_date('2017-01-12'),
        })

        self.assertEqual(False, check_range([d1], '2017-01-13'))

    def test_in(self):
        d1 = DataImport({
            'first_transaction_date': parse_date('2017-01-10'),
            'last_transaction_date': parse_date('2017-01-12'),
        })

        self.assertEqual(True, check_range([d1], '2017-01-11'))

    def test_edge(self):
        d1 = DataImport({
            'first_transaction_date': parse_date('2017-01-10'),
            'last_transaction_date': parse_date('2017-01-12'),
        })

        self.assertEqual('edge', check_range([d1], '2017-01-10'))
        self.assertEqual('edge', check_range([d1], '2017-01-12'))

    def test_between(self):
        d1 = DataImport({
            'first_transaction_date': parse_date('2017-01-10'),
            'last_transaction_date': parse_date('2017-01-12'),
        })

        d2 = DataImport({
            'first_transaction_date': parse_date('2017-01-14'),
            'last_transaction_date': parse_date('2017-01-16'),
        })

        self.assertEqual(False, check_range([d1, d2], '2017-01-13'))

    def test_edge_overlap(self):
        d1 = DataImport({
            'first_transaction_date': parse_date('2017-01-10'),
            'last_transaction_date': parse_date('2017-01-12'),
        })

        d2 = DataImport({
            'first_transaction_date': parse_date('2017-01-12'),
            'last_transaction_date': parse_date('2017-01-16'),
        })

        self.assertEqual('edge', check_range([d1, d2], '2017-01-12'))
