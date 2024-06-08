from fastapi import APIRouter, Header
from pydantic import BaseModel
from utils import summarize
from fastapi.params import Depends
from utils.bearerToken import get_bearer_token
router = APIRouter()


class Body(BaseModel):
    text: str = None


@router.post("")
def summarize_text(body: Body, token: str = Depends(get_bearer_token)):
    try:
        res = summarize.summarize(body.text, token)
        return {
            "data": {
                "response": res,
            }
        }
    except Exception as e:
        return {
            "error": {
                "response": str(e),
            }
        }
