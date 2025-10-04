from django.contrib import admin
from django.urls import path
from pages import views as pv
from authapi import views as av

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('about', pv.about, name='about'),
    path('contact', pv.contact, name='contact'),
    path('api/sentiment', pv.sentiment, name='sentiment'),
    path('', pv.dealers_home, name='dealers_home'),
    path('dealer/<str:dealer_id>', pv.dealer_detail, name='dealer_detail'),
    path('dealer/<str:dealer_id>/post-review', pv.post_review, name='post_review'),   
    path('api/register', av.api_register),
    path('api/login', av.api_login),
    path('api/logout', av.api_logout),
    path('api/me', av.api_me),
]
