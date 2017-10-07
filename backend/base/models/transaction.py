from django.db import models
from binder.models import BinderModel, ChoiceEnum
from datetime import datetime
import hashlib


class Transaction(BinderModel):
    DIRECTION = ChoiceEnum('incoming', 'outgoing')

    data_import = models.ForeignKey('DataImport', on_delete=models.PROTECT, related_name='transactions')
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='transaction')

    uid = models.TextField()
    date = models.DateField()
    direction = models.TextField(choices=DIRECTION.choices(), default=DIRECTION.OUTGOING)
    description = models.TextField()
    details = models.TextField()
    source_account = models.TextField()
    target_account = models.TextField()
    type = models.TextField()
    amount = models.IntegerField()

    def parse_from_csv(self, csv_data):
        self.amount = int(csv_data['Bedrag (EUR)'].replace(',', ''))

        self.date = datetime.strptime(csv_data['Datum'], '%Y%m%d').date()

        self.description = csv_data['Naam / Omschrijving']
        self.details = csv_data['Mededelingen']

        # To determine transaction collision, we hash the date + amount + description
        h = csv_data['Bedrag (EUR)'] + csv_data['Datum'] + csv_data['Mededelingen']
        self.uid = hashlib.sha256(h.encode()).hexdigest()

        self.target_account = csv_data['Tegenrekening']
        self.source_account = csv_data['Rekening']

        self.direction = self.__class__.DIRECTION.INCOMING if csv_data['Af Bij'] == 'Bij' else self.__class__.DIRECTION.OUTGOING

        self.type = csv_data['MutatieSoort']
