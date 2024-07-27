from django.urls import path,re_path
from .consumers import PersonalChatConsumer


websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_id>\w+)/$', PersonalChatConsumer.as_asgi()),
]