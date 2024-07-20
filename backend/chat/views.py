from django.shortcuts import render
from django.db.models import Subquery,OuterRef,Q
# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from chat.serializer import UserGetSerializer,MessageSerializer
from rest_framework.response import Response
from accounts.models import User
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework import generics
from .models import ChatMessage

from rest_framework import viewsets
from .models import ChatMessage
from .serializer import ChatMessage

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = MessageSerializer

    def get_queryset(self):
        print(user)
        user = self.request.user
        return ChatMessage.objects.filter(sender=user) | ChatMessage.objects.filter(receiver=user)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatMessage
from .serializer import MessageSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request, user_id):
    messages = ChatMessage.objects.filter(
        (Q(sender=request.user, receiver_id=user_id) | 
         Q(sender_id=user_id, receiver=request.user))
    ).order_by('date')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)