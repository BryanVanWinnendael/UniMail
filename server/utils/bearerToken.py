from fastapi.params import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer()


def get_bearer_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Custom dependency to extract the bearer token from the request header.
    """
    return credentials.credentials
