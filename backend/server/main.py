from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Waviate WhatsApp API",
    description="API for WhatsApp outreach and lead management",
    version="1.0.0"
)

class MessageRequest(BaseModel):
    phone_number: str
    message: str

class TemplateRequest(BaseModel):
    phone_number: str
    template_name: str
    parameters: Dict[str, str]

@app.get("/")
async def root():
    return {"message": "Welcome to Waviate WhatsApp API"}

@app.post("/send-message")
async def send_message(request: MessageRequest):
    try:
        # TODO: Implement WhatsApp message sending
        return {"status": "success", "message": "Message sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/send-template")
async def send_template(request: TemplateRequest):
    try:
        # TODO: Implement WhatsApp template sending
        return {"status": "success", "message": "Template sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 