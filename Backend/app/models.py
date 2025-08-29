from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField()
    email = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nome
    
class Tarefas(models.Model):
    descricao_tarefa = models.TextField()
    nome_setor = models.CharField(max_length=100)
    Usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='usuarios')
    escolha_prioridade = (
        ('BAIXA', 'Baixa'),
        ('MEDIA', 'Media'),
        ('ALTA', 'Alta')
    )
    prioridade = models.TextField(blank=True, null=True, choices=escolha_prioridade)
    data_cadastro = models.DateField()
    escolha_status = (
        ('A FAZER', 'A fazer'), #POR PADRÃO SERÁ "A FAZER"
        ('FAZENDO', 'Fazendo'),
        ('FEITO', 'Feito')        
    )

    REQUIRED_FIELDS = ['descricao', 'setor', 'usuario']

    def __str__(self):
        return self.descricao_tarefa