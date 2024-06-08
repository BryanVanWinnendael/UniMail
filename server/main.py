import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import gmail, outlook, imap, summarize


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

app.include_router(
    router=imap.router,
    prefix="/api/imap",
    tags=["imap"],
)

app.include_router(
    router=summarize.router,
    prefix="/api/summarize",
    tags=["summarize"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}
