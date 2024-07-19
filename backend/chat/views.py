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

# User = get_user_model()

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_user_list(request):
#     current_user = request.user

#     if current_user.user_type == 'normal':
#         # For normal users, get recruiters who have chat rooms with this user
#         chat_users = User.objects.filter(
#                user_type='recruiter',
#               chatrooms__participants=current_user
#            ).distinct()
#     else:  # recruiter
#         # For recruiters, get users who have chat rooms with this recruiter
#        chat_users = User.objects.filter(
#     Q(user_type='normal') | Q(user_type='recruiter'),
#     chatrooms__participants=current_user
# ).exclude(id=current_user.id).distinct()

#     serializer = UserGetSerializer(chat_users, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_user_by_id(request, id):
#     print(request.user.id,"this is the user iddd")
#     try:
#         user = User.objects.get(id=id)
#         serializer = UserGetSerializer(user)
#         return Response(serializer.data)
#     except User.DoesNotExist:
#         print("Excepttt working")
#         return Response({"error": "User not found"}, status=404)
#     except Exception as e:
#         print("Error in getting user by ID", str(e))
#         return Response({"error": "Error in getting user by ID"}, status=400)

# class MyInbox(generics.ListAPIView):
#     serializer_class = MessageSerializer

#     def get_queryset(self):
#         user_id = self.kwargs['user_id']
#         return ChatMessage.objects.filter(
#             Q(sender_id=user_id) | Q(receiver_id=user_id)
#         ).order_by('-date')

# class GetMessages(generics.ListAPIView):
#     serializer_class = MessageSerializer

#     def get_queryset(self):
#         sender_id = self.kwargs['sender_id']
#         receiver_id = self.kwargs['receiver_id']
#         return ChatMessage.objects.filter(
#             (Q(sender_id=sender_id) & Q(receiver_id=receiver_id)) |
#             (Q(sender_id=receiver_id) & Q(receiver_id=sender_id))
#         ).order_by('date')
    

# from rest_framework import generics, status
    
# from rest_framework.permissions import IsAuthenticated

# class SendMessage(generics.GenericAPIView):
#     serializer_class = MessageSerializer
#     permission_classes = [IsAuthenticated]  # Ensure this is included

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         message = serializer.save(sender=request.user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
