from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from channels.db import database_sync_to_async
from .models import Message
from accounts.models import User


class PersonalChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print("TESTING CONNECTION AND REDIS")
        request_user = self.scope['user']
        print(f"Request user: {request_user}")
        print(f"Is authenticated: {request_user.is_authenticated}")
        print(f"User details: {vars(request_user)}")  # Add this line
        if request_user.is_authenticated:
            chat_with_user = self.scope['url_route']['kwargs']['id']
            print(chat_with_user)
            user_ids = [int(request_user.id), int(chat_with_user)]
            user_ids = sorted(user_ids)
            print(user_ids,"oooooooooooooo")
            self.room_group_name = f"chat_{user_ids[0]}-{user_ids[1]}"
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
        await self.accept()

    @database_sync_to_async
    def save_message(self, sender, receiver, content):
        Message.objects.create(sender=sender, receiver=receiver, content=content)
    
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data["message"]
        sender = self.scope['user']
        receiver_id = int(self.scope['url_route']['kwargs']['id'])
        receiver = await database_sync_to_async(User.objects.get)(id=receiver_id)

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
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            "message": message,
            "sent": event['user_id'] == self.scope['user'].id
        }))
