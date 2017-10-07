from ..models.data_import import DataImport
from binder.router import list_route
from binder.views import ModelView
from django.conf import settings
import os


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
