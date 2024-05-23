from fastapi import APIRouter, Header
from utils import outlook
from fastapi.params import Depends
from utils.bearerToken import get_bearer_token
router = APIRouter()


@router.get("")
def get_emails(token: str = Depends(get_bearer_token), refresh_token: str = Header(None)):
    try:
        return outlook.get_emails(token)
    except Exception as e:
        print(e)
        return {"error": str(e)}
