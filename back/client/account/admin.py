from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email','user_name', 'phone', 'is_staff','is_active')
    list_filter = ('email', 'user_name', 'phone', 'is_staff','is_active')
    search_fields = ('email','user_name', 'phone')
    ordering = ('email',)
    fieldsets = (
       ('Authentication',{
           "fields":(
               'email','password'
           ),
       }),
       ('permissions', {
           "fields": (
               'is_staff', 'is_active','is_superuser'

           ),
       }),
   )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email','user_name', 'phone' , 'password1','password2', 'is_staff', 'is_active','is_superuser')}
         ),
    )

admin.site.register(User,CustomUserAdmin)
admin.site.register(Profile)

