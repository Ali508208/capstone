from django.db import models

class CarMake(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class CarModel(models.Model):
    SEDAN="Sedan"; SUV="SUV"; WAGON="Wagon"; TRUCK="Truck"
    TYPES=[(SEDAN,"Sedan"),(SUV,"SUV"),(WAGON,"Wagon"),(TRUCK,"Truck")]

    name = models.CharField(max_length=64)
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name="models")
    dealer_id = models.IntegerField(default=0)
    type = models.CharField(max_length=16, choices=TYPES, default=SEDAN)
    year = models.DateField()

    def __str__(self):
        return f"{self.car_make} {self.name}"
