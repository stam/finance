from django.core.management.base import BaseCommand
from ...models.query import Query

class Command(BaseCommand):
    help = 'Manually runs all queries'

    def handle(self, *args, **options):
        for query in Query.objects.all():
            query.matched_transactions().update(
                category_id=query.category_id,
                query_id=query.id
            )
