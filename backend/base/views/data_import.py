from ..models.data_import import DataImport
from ..models.query import Query
from ..models.balance import Balance
from ..models.transaction import Transaction
from binder.router import list_route
from binder.views import ModelView
from django.conf import settings
import os
import datetime
import requests


class DataImportView(ModelView):
    model = DataImport

    @list_route(name='upload', methods=['POST'])
    def upload(self, request):
        if 'file' not in request.FILES:
            # Error: no file found
            return

        file = self.request.FILES['file']

        # Store the uploaded file
        path = self.save_file(file)

        # Create an import, set the file location
        i = DataImport(file_path=path, user=request.user)
        i.save()

        import_range = self.get_import_range(request.user)
        i.parse_csv(import_range, request.user)
        i.calculate_metrics()

        # Rerun the queries on the newly imported data
        # so the new transactions get the correct category labels
        Query.run_all(request.user)

        # Update the balance with the new transactions
        Balance.recalculate(i)

        return self.get(request, pk=i.id)

    @list_route(name='scrape', methods=['POST'])
    def scrape(self, request):
        # With this new import, the pending transaction should be removed
        Transaction.objects.filter(type="PENDING").delete()

        last_import = DataImport.objects.order_by('-last_transaction_date').first()

        if last_import:
            start_date = last_import.last_transaction_date
        else:
            start_date = datetime.date.today() - datetime.timedelta(30)

        end_date = datetime.date.today()

        params = {
            "startDate": start_date.strftime('%Y-%m-%d'),
            "endDate": end_date.strftime('%Y-%m-%d')
        }

        r = requests.post("http://scraper:8080/", json=params)

        if r.status_code == 400:
            print(r.text)
        parsed_balance = int(r.headers["X-Account-Budget"].replace('.', ''))

        i = DataImport(file_path="", user=request.user)
        i.save()

        import_range = self.get_import_range(request.user)
        i.parse(r.text.split('\n'), import_range, request.user)
        i.calculate_metrics()

        # Rerun the queries on the newly imported data
        # so the new transactions get the correct category labels
        Query.run_all(request.user)

        # Set balance to the new balance
        b = Balance(user=request.user, after_import=i, amount=parsed_balance)
        b.save()

        return self.get(request, pk=i.id)

    def save_file(self, file):
        if file.name == '':
            # Error: no selected file
            return

        write_path = os.path.join(settings.MEDIA_ROOT, file.name)

        if not os.path.exists(settings.MEDIA_ROOT):
            os.makedirs(settings.MEDIA_ROOT, mode=0o755)

        with open(write_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        return write_path

    def get_import_range(self, user):
        existing_imports = DataImport.objects.filter(user=user).all()
        return DataImport.create_range(existing_imports)
