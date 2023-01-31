from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'phone', 'is_staff','is_active',"is_verified")
    list_filter = ('email', 'phone', 'is_staff','is_active', 'is_verified')
    search_fields = ('email', 'phone')
    ordering = ('email',)
    fieldsets = (
       ('Authentication',{
           "fields":(
               'email','password'
           ),
       }),
       ('permissions', {
           "fields": (
               'is_staff', 'is_active','is_superuser','is_verified'

           ),
       }),
   )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone' , 'password1','password2', 'is_staff', 'is_active','is_superuser','is_verified')}
         ),
    )

admin.site.register(User,CustomUserAdmin)
admin.site.register(Profile)
admin.site.register(Adress)
