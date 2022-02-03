
from rest_framework.response import Response

from rest_framework import permissions, renderers, viewsets
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend

from app.models import *

from app.serializers import *

class CategoryViewSet(viewsets.ModelViewSet):
     queryset = Category.objects.all()
     serializer_class = CategorySerializer
     #permission_classes = [permissions.IsAuthenticated]
     filter_backends = [DjangoFilterBackend]
     filterset_fields = '__all__'

#     @action(detail=False, methods=['GET'], name='Get Income')
#     def income(self, request, format=None):
#         queryset = Category.objects.filter(category_income = True)
#         serializer = CategorySerializer(queryset, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['GET'], name='Get Spending')
#     def spending(self, request, format=None):
#          queryset = Category.objects.filter(category_income = False)
#          serializer = CategorySerializer(queryset, many=True)
#          return Response(serializer.data)
