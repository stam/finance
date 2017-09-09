from app import db
from chimera.models import Base
from datetime import datetime
import enum
import hashlib


class Direction(enum.Enum):
    add = 'add'
    subtract = 'subtract'


class Transaction(Base, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data_import_id = db.Column(db.Integer, db.ForeignKey('data_import.id', ondelete='cascade'))
    data_import = db.relationship('DataImport', foreign_keys='Transaction.data_import_id',
        backref=db.backref('transactions', lazy='dynamic', cascade='all, delete-orphan'))

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='cascade'))
    user = db.relationship('User',
        backref=db.backref('transactions', lazy='dynamic', cascade='all, delete-orphan'))

    uid = db.Column(db.Text)
    processed_at = db.Column(db.Date)
    direction = db.Column(db.Enum(Direction))
    description = db.Column(db.Text)
    details = db.Column(db.Text)
    source_account = db.Column(db.Text)
    target_account = db.Column(db.Text)
    type = db.Column(db.Text)
    amount = db.Column(db.Integer)

    def parse_from_csv(self, csv_data):
        data = {}

        data['amount'] = int(csv_data['Bedrag (EUR)'].replace(',', ''))

        data['processed_at'] = datetime.strptime(csv_data['Datum'], '%Y%m%d').date()

        data['description'] = csv_data['Naam / Omschrijving']
        data['details'] = csv_data['Mededelingen']

        # To determine transaction collision, we hash the date + amount + description
        h = csv_data['Bedrag (EUR)'] + csv_data['Datum'] + csv_data['Mededelingen']
        data['uid'] = hashlib.sha256(h.encode()).hexdigest()

        data['target_account'] = csv_data['Tegenrekening']
        data['source_account'] = csv_data['Rekening']

        data['direction'] = Direction.add if csv_data['Af Bij'] == 'Bij' else Direction.subtract

        data['type'] = csv_data['MutatieSoort']

        self.parse(data)
