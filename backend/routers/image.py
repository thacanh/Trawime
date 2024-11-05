from fastapi import APIRouter, UploadFile, File, HTTPException
from concurrent.futures import ThreadPoolExecutor, as_completed
from utils import GoogleLensUploader, process_article
import os
import shutil

router = APIRouter()

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    try:
        temp_image_path = f"temp_{file.filename}"
        with open(temp_image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        uploader = GoogleLensUploader()
        links = uploader.upload_to_lens(temp_image_path)
        
        if not links:
            return {"error": "Không tìm thấy kết quả nào từ Google Lens"}

        all_locations = []
        with ThreadPoolExecutor(max_workers=5) as executor:
            future_to_url = {executor.submit(process_article, url): url for url in links}
            for future in as_completed(future_to_url):
                locations = future.result()
                all_locations.extend(locations)
        
        os.remove(temp_image_path)

        return {
            "status": "success",
            "links": links,
            "locations": all_locations,
            "total_locations": len(all_locations)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
