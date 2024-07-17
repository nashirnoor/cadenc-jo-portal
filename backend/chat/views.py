from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from chat.serializer import UserGetSerializer
from rest_framework.response import Response
from accounts.models import User
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_list(request):
    current_user = request.user

    if current_user.user_type == 'normal':
        # For normal users, get recruiters who have chat rooms with this user
        chat_users = User.objects.filter(
               user_type='recruiter',
              chatrooms__participants=current_user
           ).distinct()
    else:  # recruiter
        # For recruiters, get users who have chat rooms with this recruiter
       chat_users = User.objects.filter(
    Q(user_type='normal') | Q(user_type='recruiter'),
    chatrooms__participants=current_user
).exclude(id=current_user.id).distinct()

    serializer = UserGetSerializer(chat_users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, id):
    print(request.user.id,"this is the user iddd")
    try:
        user = User.objects.get(id=id)
        serializer = UserGetSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        print("Excepttt working")
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        print("Error in getting user by ID", str(e))
        return Response({"error": "Error in getting user by ID"}, status=400)
