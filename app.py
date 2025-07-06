from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

app = FastAPI()

model_path = "output_dir"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development me * rakho, production me specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


tokenizer = GPT2Tokenizer.from_pretrained(model_path)
model = GPT2LMHeadModel.from_pretrained(model_path)
model.eval()

if torch.cuda.is_available():
    model.to("cuda")

class InputText(BaseModel):
    prompt: str
    max_length: int = 100

@app.get("/")
def root():
    return {"message": "GPT-2 Text Generation API is running!"}

@app.post("/generate")
def generate_text(data: InputText):
    inputs = tokenizer.encode(data.prompt, return_tensors="pt")

    if torch.cuda.is_available():
        inputs = inputs.to("cuda")

    with torch.no_grad():
        outputs = model.generate(
            inputs,
            max_length=data.max_length,
            num_return_sequences=1,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.7
        )

    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"generated_text": generated_text}
