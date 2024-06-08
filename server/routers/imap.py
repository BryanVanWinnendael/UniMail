from fastapi import APIRouter, Header
from pydantic import BaseModel
from utils import imap
from fastapi.params import Depends
from utils.bearerToken import get_bearer_token
router = APIRouter()


@router.get("")
def get_user_emails(token: str = Depends(get_bearer_token), email: str = Header(None), imap_server: str = Header(None), imap_port: int = Header(None)):
    try:
        return {
            "data": {
                "emails": imap.get_emails(email, token, imap_server, imap_port),
                "user": email,
                "platform": "imap"
            }
        }
    except Exception as e:
        return {
            "error": {
                "user": email,
                "message": str(e),
            }
        }


class IMAP(BaseModel):
    email: str = None
    imap_server: str = None
    imap_port: int = None


@router.post("")
def try_connection(imapBody: IMAP, token: str = Depends(get_bearer_token)):
    try:
        email = imapBody.email
        imap_server = imapBody.imap_server
        imap_port = imapBody.imap_port

        return imap.test_connection(email, token, imap_server, imap_port)
    except Exception as e:
        return False
