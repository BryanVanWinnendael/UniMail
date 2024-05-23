from fastapi import APIRouter, Header
from utils import gmail
from fastapi.params import Depends
from utils.bearerToken import get_bearer_token
router = APIRouter()


@router.get("")
def get_emails(token: str = Depends(get_bearer_token), refresh_token: str = Header(None), email: str = Header(None), latest_email_time: str = Header(None)):
    try:
        return gmail.get_emails(token, refresh_token, email, int(latest_email_time))
    except Exception as e:
        return {"error": str(e)}
