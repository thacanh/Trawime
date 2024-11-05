from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import jwt
from jwt import PyJWTError as JWTError
from passlib.context import CryptContext
import models
import schemas
import auth
from database import engine, get_db
import os
import shutil
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import google.generativeai as genai
from newspaper import Article
import time
from urllib.parse import unquote
import re
import requests
from fake_useragent import UserAgent
from concurrent.futures import ThreadPoolExecutor, as_completed

# Cấu hình Gemini API key
GOOGLE_API_KEY = 'AIzaSyCyAEADKuRmUQRPpkxxYFwUTy-O5BbRoT4'
genai.configure(api_key=GOOGLE_API_KEY)

# Tạo các bảng trong cơ sở dữ liệu
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GoogleLensUploader:
    def __init__(self):
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        self.driver = webdriver.Chrome(options=options)
        
    def upload_to_lens(self, image_path):
        try:
            self.driver.get('https://lens.google.com')
            time.sleep(1)  
            try:
                upload_input = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']"))
                )
                upload_input.send_keys(image_path)
            except Exception as e:
                print(f"Lỗi upload ảnh: {str(e)}")
                return []

            print("Đã upload ảnh, đang đợi kết quả...")
            time.sleep(3) 
            links = set()
            selectors = [
                'a[jscontroller]',
                'a[href^="http"]',
                'div[role="main"] a',
                '.NIoIEf',
                'div[style*="cursor:pointer"] a'
            ]

            for selector in selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in elements:
                        try:
                            href = element.get_attribute('href')
                            if href and 'google.com' not in href:
                                links.add(href)
                                if len(links) >= 10:
                                    break
                        except:
                            continue
                    if len(links) >= 10:
                        break
                except Exception as e:
                    print(f"Lỗi với selector {selector}: {str(e)}")

            return list(links)

        except Exception as e:
            print(f"Có lỗi xảy ra: {str(e)}")
            return []

    def __del__(self):
        try:
            self.driver.quit()
        except:
            pass

def get_headers():
    ua = UserAgent()
    return {
        'User-Agent': ua.random,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }

def extract_locations_from_url(url):
    try:
        decoded_url = unquote(url)
        cleaned_url = re.sub(r'https?://|www\.|\.html|\.htm|\.php', '', decoded_url)
        
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"""
        Hãy phân tích URL sau và trích xuất các địa điểm du lịch có thể có.
        Chỉ trả về danh sách các địa điểm, không kèm theo giải thích.
        Nếu không có địa điểm nào thì không được phép gửi gì cả, trả về giá trị rỗng
        
        URL: {cleaned_url}
        
        Địa điểm:"""

        response = model.generate_content(prompt)
        locations = response.text.strip().split('\n')
        locations = [loc.strip('- ').strip() for loc in locations if loc.strip('- ').strip()]
        
        return locations
    except Exception as e:
        print(f"Error extracting from URL: {str(e)}")
        return []

def extract_locations_from_content(text):
    try:
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"""
        Hãy trích xuất các địa điểm du lịch từ đoạn văn bản sau. 
        Chỉ trả về danh sách các địa điểm, không kèm theo giải thích.
        Nếu không có địa điểm nào thì không được phép gửi gì cả, trả về giá trị rỗng
        
        Văn bản: {text}
        
        Địa điểm:"""

        response = model.generate_content(prompt)
        locations = response.text.strip().split('\n')
        locations = [loc.strip('- ').strip() for loc in locations if loc.strip('- ').strip()]
        
        return locations
    except Exception as e:
        print(f"Error extracting from content: {str(e)}")
        return []

def process_article(url):
    try:
        locations_from_url = extract_locations_from_url(url)
        
        session = requests.Session()
        session.headers.update(get_headers())
        
        try:
            response = session.get(url, timeout=10)
            if response.status_code == 200:
                article = Article(url, language='vi')
                article.download_state = 2
                article.html = response.text
                article.parse()
                
                title = article.title
                text = article.text[:500]
                combined_text = f"Tiêu đề: {title}\n\nNội dung: {text}"
                
                locations_from_content = extract_locations_from_content(combined_text)
            else:
                print(f"Failed to fetch {url}, status code: {response.status_code}")
                locations_from_content = []
        except Exception as e:
            print(f"Error downloading content from {url}: {str(e)}")
            locations_from_content = []
        
        all_locations = list(set(locations_from_url + locations_from_content))
        return all_locations
    except Exception as e:
        print(f"Error processing article {url}: {str(e)}")
        return []

# API endpoints
@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}

@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã được đăng ký"
        )
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not auth.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(
    token: str = Depends(auth.oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@app.post("/change-password")
async def change_password(
    request: schemas.ChangePasswordRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if not auth.verify_password(request.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Mật khẩu hiện tại không chính xác"
        )
    
    try:
        current_user.hashed_password = auth.get_password_hash(request.new_password)
        db.commit()
        return {"message": "Mật khẩu đã được cập nhật thành công"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi cập nhật mật khẩu"
        )

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    try:
        # Lưu file tạm thời
        temp_image_path = f"C:\\Users\\thaca\\Trawime\\backend\\uploads\\{file.filename}"
        with open(temp_image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Upload ảnh lên Google Lens
        uploader = GoogleLensUploader()
        links = uploader.upload_to_lens(temp_image_path)
        
        if not links:
            return {"error": "Không tìm thấy kết quả nào từ Google Lens"}

        # Xử lý các URL để trích xuất địa điểm
        all_locations = []
        with ThreadPoolExecutor(max_workers=5) as executor:
            future_to_url = {executor.submit(process_article, url): url for url in links}
            for future in as_completed(future_to_url):
                locations = future.result()
                all_locations.extend(locations)
                time.sleep(1)

        # Xóa file tạm
        os.remove(temp_image_path)

        # Chuẩn hóa danh sách địa điểm
        model = genai.GenerativeModel('gemini-pro')
        locations_str = "\n".join(list(set(all_locations)))
        
        prompt = f"""
        Hãy xem xét danh sách các địa điểm du lịch sau và:
        1. Loại bỏ những địa điểm không phải địa điểm du lịch
        2. Chuẩn hóa tên địa điểm (thêm tỉnh/thành phố)
        3. Sắp xếp theo thứ tự alphabet
        4. Gộp các địa điểm trùng lặp hoặc tương tự
        5. Chỉ trả về danh sách các địa điểm đã chuẩn hóa, mỗi địa điểm một dòng
        
        Danh sách địa điểm:
        {locations_str}
        
        Danh sách đã chuẩn hóa:"""

        response = model.generate_content(prompt)
        final_locations = response.text.strip().split('\n')
        final_locations = [loc.strip('- ').strip() for loc in final_locations if loc.strip('- ').strip()]

        return {
            "status": "success",
            "links": links,
            "locations": final_locations,
            "total_locations": len(final_locations)
        }

    except Exception as e:
        return {"error": str(e)}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"./uploads/{file.filename}"
    os.makedirs(os.path.dirname(file_location), exist_ok=True)
    with open(file_location, "wb") as f:
        content = await file.read()
        f.write(content)
    return {"filename": file.filename}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)