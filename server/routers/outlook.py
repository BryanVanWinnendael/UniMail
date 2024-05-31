from fastapi import APIRouter, Header
from utils import outlook
from fastapi.params import Depends
from utils.bearerToken import get_bearer_token
router = APIRouter()


@router.get("")
def get_emails(token: str = Depends(get_bearer_token), refresh_token: str = Header(None), email: str = Header(None), latest_email_time: str = Header(None)):
    try:
        return {
            "data": {
                "emails": outlook.get_emails(token, email, int(latest_email_time)),
                "user": email,
                "platform": "outlook"
            }
        }
    except Exception as e:
        return {
            "error": {
                "user": email,
                "message": str(e),
            }
        }
