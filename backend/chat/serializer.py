from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ChatMessage
from accounts.serializers import UserSerialzier


class UserGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['email', 'first_name', 'id']
        extra_kwargs = {'id': {'read_only':True}}


class MessageSerializer(serializers.ModelSerializer):
    receiver_profile = UserSerialzier(read_only=True)
    sender_profile = UserSerialzier(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'sender_profile', 'receiver', 'receiver_profile', 'content', 'is_read', 'date']