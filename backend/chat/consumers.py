from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from channels.db import database_sync_to_async
from .models import ChatMessage
from accounts.models import User
from django.utils import timezone  # Add this import at the top of your file
from datetime import datetime

class PersonalChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        request_user = self.scope['user']
        if request_user.is_authenticated:
            chat_with_user = self.scope['url_route']['kwargs']['id']
            user_ids = [int(request_user.id), int(chat_with_user)]
            user_ids = sorted(user_ids)
            self.room_group_name = f"chat_{user_ids[0]}-{user_ids[1]}"
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
        await self.accept()

    @database_sync_to_async
    def save_message(self, sender, receiver, content):
        ChatMessage.objects.create(sender=sender, receiver=receiver, content=content)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data["message"]
        sender = self.scope['user']
        receiver_id = int(self.scope['url_route']['kwargs']['id'])
        receiver = await self.get_user(receiver_id)

        if receiver is None:
            await self.send(text_data=json.dumps({
                "error": f"User with id {receiver_id} does not exist."
            }))
            return

        await self.save_message(sender, receiver, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "user_id": sender.id
            }
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def chat_message(self, event):
        message = event['message']
        timestamp = timezone.now().isoformat()
        await self.send(text_data=json.dumps({
            "message": message,
            "sent": event['user_id'] == self.scope['user'].id,
            "date": timestamp
        }))
