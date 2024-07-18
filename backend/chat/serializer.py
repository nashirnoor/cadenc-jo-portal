from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ChatMessage
from accounts.serializers import UserRegisterSerializer,UserSerialzier


class UserGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['email', 'first_name', 'id']
        extra_kwargs = {'id': {'read_only':True}}


class MessageSerializer(serializers.ModelSerializer):
    receiver_profile = UserSerialzier(read_only=True)
    sender_profile =  UserSerialzier(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id','user','sender','sender_profile','receiver','receiver_profile','message','is_read','date']