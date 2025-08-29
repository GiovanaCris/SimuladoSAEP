from django.urls import path
from .views import UsuarioListCreate, UsuarioRestrieveUpdateDestroy, TarefasListCreate, TarefasRetrieveUpdateDestroy

urlpatterns = [
    #Usuario
    path('usuario/', UsuarioListCreate.as_view()),
    path('usuario/<int:pk>/', UsuarioRestrieveUpdateDestroy.as_view()),
    
    #Tarefas
    path('reservas/', TarefasListCreate.as_view()),
    path('reservas/<int:pk>/', TarefasRetrieveUpdateDestroy.as_view()),
]