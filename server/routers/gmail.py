from fastapi import APIRouter, Header
from utils import gmail
from fastapi.params import Depends
from utils.bearerToken import get_bearer_token
router = APIRouter()


@router.get("")
def get_user_emails(token: str = Depends(get_bearer_token), refresh_token: str = Header(None), email: str = Header(None)):
    try:
        emails = gmail.get_emails(
            token, refresh_token, email)
        return {
            "data": {
                "emails": emails,
                "user": email,
                "platform": "gmail"
            }
        }
    except Exception as e:
        return {
            "error": {
                "user": email,
                "message": str(e),
            }
        }
