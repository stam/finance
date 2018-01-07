from django.contrib.auth.models import User
from ..models import DataImport, Transaction, Query, Category, Balance

user_counter = 0
def user_data():
    global user_counter
    user_counter += 1
    return {
        'username': 'user_%d' % user_counter,
        'email': 'user_%d@example.com' % user_counter,
        'password': 'password_%d' % user_counter,
    }
def user_model(**args):
    user = User(**dict(list(user_data().items())+list(args.items())))
    user.save()
    return user



def data_import_data():
    return {
        'file_path': 'link/to/file',
    }
def data_import_model(**args):
    if 'user' not in args:
        args['user'] = user_model()

    data_import = DataImport(**dict(list(data_import_data().items())+list(args.items())))
    data_import.save()
    return data_import



def transaction_data():
    return {
        'uid': 'test',
        'date': '2017-04-22',
        'direction': 'outgoing',
        'summary': 'Bike stuff',
        'details': 'Bike order from bikestuff.com',
        'source_account': '123',
        'target_account': '456',
        'type': 'internet transaction',
        'amount': 34999,
    }
def transaction_model(**args):
    if 'data_import' not in args:
        args['data_import'] = data_import_model()
    if 'user' not in args:
        args['user'] = user_model()

    transaction = Transaction(**dict(list(transaction_data().items())+list(args.items())))
    transaction.save()
    return transaction



def category_data():
    return {
        'name': 'Groceries',
        'color': '#fff',
    }
def category_model(**args):
    if 'user' not in args:
        args['user'] = user_model()

    category = Category(**dict(list(category_data().items())+list(args.items())))
    category.save()
    return category


def balance_data():
    return {
        'amount': 1337
    }
def balance_model(**args):
    if 'user' not in args:
        args['user'] = user_model()

    if 'after_import' not in args:
        args['after_import'] = data_import_model()

    balance = Balance(**dict(list(balance_data().items())+list(args.items())))
    balance.save()
    return balance


def query_data():
    return {
        'name': 'Supermarket',
        'matcher': {
            'column': 'summary',
            'operator': 'icontains',
            'value': 'Supermarket',
        }
    }
def query_model(**args):
    if 'user' not in args:
        args['user'] = user_model()
    if 'category' not in args:
        args['category'] = category_model()

    query = Query(**dict(list(query_data().items())+list(args.items())))
    query.save()
    return query
