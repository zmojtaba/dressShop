from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
import threading

class customRefreshToken(RefreshToken):
    lifetime = timedelta(minutes=5)

def get_token_for_email_verification(user):
    refresh = customRefreshToken.for_user(user)
    access = refresh.access_token
    return str(refresh), str(access)

# this part should move to utils.py
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token
    return str(refresh), str(access)

class EmailThreading(threading.Thread):
    def __init__(self, message):
        threading.Thread.__init__(self)
        self.message = message
        
    def run(self):
        self.message.send()