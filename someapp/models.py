from django.db import models

class Car(models.Model):
    brand = models.CharField('Марка', max_length=100)
    model = models.CharField('Модель', max_length=100)
    year = models.IntegerField('Год')
    price = models.IntegerField('Цена (руб)')
    mileage = models.IntegerField('Пробег (км)', default=0)
    fuel = models.CharField('Топливо', max_length=50, default='Бензин')
    transmission = models.CharField('КПП', max_length=50, default='Автомат')
    body = models.CharField('Кузов', max_length=50, default='Седан')
    color = models.CharField('Цвет', max_length=50, default='Черный')
    image = models.URLField('URL изображения', blank=True)
    description = models.TextField('Описание', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta: ordering = ['-id']
    def __str__(self): return f'{self.brand} {self.model} ({self.year})'

class Order(models.Model):
    STATUS_CHOICES = [('new', 'Новая'), ('done', 'Обработана'), ('cancel', 'Отменена')]
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='orders')
    name = models.CharField('Имя', max_length=100)
    phone = models.CharField('Телефон', max_length=30)
    comment = models.TextField('Комментарий', blank=True)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta: ordering = ['-id']
    def __str__(self): return f'Заявка #{self.id} - {self.name}'
