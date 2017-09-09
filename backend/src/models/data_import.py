import os
import csv
from datetime import datetime
from app import db
from werkzeug.utils import secure_filename
from .transaction import Transaction
from chimera.models import Base


class DataImport(Base, db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='cascade'))
    user = db.relationship('User',
        backref=db.backref('data_imports', lazy='dynamic', cascade='all, delete-orphan'))

    date = db.Column(db.DateTime)
    filename = db.Column(db.Text)
    first_transaction_date = db.Column(db.Date)
    last_transaction_date = db.Column(db.Date)

    @staticmethod
    def create_range(imports):
        dates = []
        for i in imports:
            if not i.first_transaction_date:
                continue
            dates.append((i.first_transaction_date, i.last_transaction_date))

        # Order them on first transaction date
        dates.sort(key=lambda d: d[0])
        return dates

    @staticmethod
    def is_in_range(ranges, date):
        for r in ranges:
            if date > r[0] and date < r[1]:
                return True
            if date == r[0] or date == r[1]:
                return 'edge'
        return False

    @staticmethod
    def transaction_exists(in_range, t):
        if in_range == 'edge':
            return Transaction.query.filter_by(uid=t.uid, user=t.user).count() > 0

        return in_range


def zip_csv(header, row):
    output = {}
    for i, key in enumerate(header):
        output[key] = row[i]

    return output


class Controller:
    def __init__(self, db, app, user, request):
        self.db = db
        self.app = app
        self.user = user
        self.request = request

    def create_import(self, filename):
        i = DataImport({})
        i.date = datetime.now()
        i.filename = filename
        i.user = self.user

        return i

    def handle_fileupload(self):
        if 'file' not in self.request.files:
            # Error: no file found
            return

        f = self.request.files['file']

        # Store the uploaded file
        filename = self.save_file(f)

        # File already exists
        if not filename:
            return

        # Create an import, set the file location
        i = self.create_import(filename)

        # Actually parse the file
        # For each row, create a Transaction
        # Save everything, return the import
        self.parse_csv(i)

        # We don't want duplicate transactions
        # Look at which transaction range is covered by earlier imports
        # And ignore those for the current import
        self.calculate_metrics(i)

        db.session.commit()
        return i

    def save_file(self, file):
        if file.filename == '':
            # Error: no selected file
            return

        filename = secure_filename(file.filename)
        pathname = os.path.join(self.app.config['UPLOAD_FOLDER'], filename)

        if os.path.exists(pathname):
            from pudb import set_trace; set_trace()
            # os.remove(pathname)
            return
        else:
            file.save(pathname)

        return filename

    def get_user_import_range(self):
        existing_imports = DataImport.query.filter(DataImport.user == self.user).all()
        return DataImport.create_range(existing_imports)

    def parse_csv(self, dataimport):
        pathname = os.path.join(self.app.config['UPLOAD_FOLDER'], dataimport.filename)

        with open(pathname, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter=',', quotechar='"')

            header = next(reader)
            r = self.get_user_import_range()

            for row in reader:
                data = zip_csv(header, row)
                t = Transaction()
                t.parse_from_csv(data)
                t.user = self.user

                in_range = DataImport.is_in_range(r, t.processed_at)
                t_exists = DataImport.transaction_exists(in_range, t)

                if t_exists:
                    continue

                t.data_import = dataimport
                db.session.add(t)

    def calculate_metrics(self, dataimport):
        t_first = dataimport.transactions.order_by(Transaction.processed_at).first()
        t_last = dataimport.transactions.order_by(Transaction.processed_at.desc()).first()

        dataimport.first_transaction_date = t_first.processed_at
        dataimport.last_transaction_date = t_last.processed_at

        db.session.add(dataimport)
