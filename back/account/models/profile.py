from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
User = get_user_model()

class Adress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='adress_user')
    state = models.CharField(max_length=200)
    city = models.CharField(max_length=200)
    street = models.CharField(max_length=200)
    alley = models.CharField(max_length=200)
    plaque = models.CharField(max_length=200)
    postalـcode = models.CharField(max_length=200)
    extra_commnent = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.state} {self.city}"


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    adress = models.ManyToManyField(Adress, related_name='profile_adress')
    first_name = models.CharField(max_length=250, blank=True, null=True)
    last_name = models.CharField(max_length=250, blank=True, null=True)
    image = models.ImageField(upload_to="profile/%Y/%m/%d/",blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email

@receiver(post_save, sender=User)
def save_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)