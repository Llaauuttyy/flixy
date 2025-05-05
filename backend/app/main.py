from typing import Union

from fastapi import FastAPI

from .dto.sign_up import SignUpForm

app = FastAPI()


@app.get("/")
def read_root():
    return {"Health": "Ok!"}


@app.post("/sign-up")
async def login(sign_up_form: SignUpForm):
    return {"form": sign_up_form}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
