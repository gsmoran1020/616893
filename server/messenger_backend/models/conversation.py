from django.db import models
from django.db.models import Q

from . import utils
from .user import User


class Conversation(utils.CustomModel):
    # conversationSignature exists as a secondary identifier for use
    # in the find_conversation method when the ID is unknown and we need
    # to find a conversation amongst potentially similar group conversations.
    conversationSignature = models.TextField(null=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, db_column="userId", related_name="+"
    )
    otherUsers = models.ManyToManyField(User)
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    # find conversation given primary userId and signature
    def find_conversation(userId, conversationSignature):
        # return conversation or None if it doesn't exist
        try:
            return Conversation.objects.get(
                (Q(user__id=userId) & Q(conversationSignature__exact=conversationSignature))
            )
        except Conversation.DoesNotExist:
            return None

    
    # add otherUser to conversation
    def add_other_user(convoId, other_userId):
        # return True or False if addition was unsuccessful
        try:
            convo = Conversation.objects.get(pk=convoId)
            other_user = User.objects.get(pk=other_userId)
            if other_user not in convo.otherUsers.all():
                convo.otherUsers.add(other_user)
                return True
            return False
        except:
            return False