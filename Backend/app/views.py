from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from .models import Usuario, Tarefas
from .serializers import UsuarioSerializer, TarefaSerializer   

class UsuarioListCreate(ListCreateAPIView): #Listar e criar
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UsuarioRestrieveUpdateDestroy(RetrieveDestroyAPIView): #Editar e deletar
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    lookup_field = 'pk'

class TarefasListCreate(ListCreateAPIView): #Listar e criar
    queryset = Tarefas.objects.all()
    serializer_class = TarefaSerializer
    
class TarefasRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Tarefas.objects.all()
    serializer_class = TarefaSerializer
    lookup_field = 'pk'