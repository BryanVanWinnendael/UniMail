from fastapi import APIRouter, Header
from utils import yahoo
from fastapi.params import Depends
from utils.bearerToken import get_bearer_token
router = APIRouter()


@router.get("")
def get_user_emails(token: str = Depends(get_bearer_token), email: str = Header(None)):
    try:
        return {
            "data": {
                "emails": yahoo.get_emails(token, email),
                "user": email,
                "platform": "yahoo"
            }
        }
    except Exception as e:
        return {
            "error": {
                "user": email,
                "message": str(e),
            }
        }
