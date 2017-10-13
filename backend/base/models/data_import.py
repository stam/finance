from django.db import models
from binder.models import BinderModel
from .transaction import Transaction
import csv


def zip_csv(header, row):
    output = {}
    for i, key in enumerate(header):
        output[key] = row[i]

    return output

class DataImport(BinderModel):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='data_imports')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    file_path = models.TextField()
    first_transaction_date = models.DateField(null=True, blank=True)
    last_transaction_date = models.DateField(null=True, blank=True)

    def parse_csv(self, import_range, user):
        with open(self.file_path, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter=',', quotechar='"')

            header = next(reader)

            for row in reader:
                data = zip_csv(header, row)
                t = Transaction()
                t.parse_from_csv(data)
                t.user = user

                in_range = DataImport.is_in_range(import_range, t.date)
                t_exists = DataImport.transaction_exists(in_range, t)

                if t_exists:
                    continue

                t.data_import = self
                t.save()

    def calculate_metrics(self):
        t_first = self.transactions.order_by('date').first()
        t_last = self.transactions.order_by('-date').first()

        self.first_transaction_date = t_first.date
        self.last_transaction_date = t_last.date

        self.save()

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
            return Transaction.objects.filter(uid=t.uid, user=t.user).count() > 0

        return in_range
