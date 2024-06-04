import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import gmail, outlook


load_dotenv()
app = FastAPI()

origins = [os.environ.get("ORIGIN")]

print(f"Allowed origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    router=gmail.router,
    prefix="/api/gmail",
    tags=["gmail"],
)

app.include_router(
    router=outlook.router,
    prefix="/api/outlook",
    tags=["outlook"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}
