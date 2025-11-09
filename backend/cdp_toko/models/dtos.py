from pydantic import BaseModel

class SignInDTO(BaseModel):
    username: str
    password: str

