from django.db import models
from django.contrib.auth import get_user_model
from accounts.models import User
from django.conf import settings

User = get_user_model()



class ChatMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.CharField(max_length=1000)
    is_read = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ['date']
        verbose_name_plural = "Messages"

    def __str__(self):
        return f"{self.sender} - {self.receiver}"

    @property
    def sender_profile(self):
        return self.sender

    @property
    def receiver_profile(self):
        return self.receiver



    
# class ChatRoom(models.Model):
#     participants = models.ManyToManyField(User, related_name='chatrooms')
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"ChatRoom {self.id}"