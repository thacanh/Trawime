from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True  # Sử dụng orm_mode để tương thích với SQLAlchemy

class Token(BaseModel):
    access_token: str
    token_type: str
