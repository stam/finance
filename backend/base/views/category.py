from binder.views import ModelView
from ..models.category import Category

class CategoryView(ModelView):
    model = Category
    unwritable_fields = ['created_at', 'updated_at']
