# 🧠 TextGen-AI

**TextGen-AI** is a web-based text generation tool powered by a fine-tuned **GPT-2 model**. It uses **FastAPI** as a backend and a responsive frontend built with **HTML, CSS, and JavaScript**. You simply enter a prompt, and it generates coherent, creative text!

---

## 🚀 Features

- ✨ GPT-2 based text generation
- ⚡ FastAPI backend API
- 🎨 Clean, responsive frontend
- 🔁 Real-time output with typing animation
- 📋 Copy to clipboard functionality
- 🧹 Model file not included (see below)

---

## 📦 Tech Stack

| Part        | Technology                |
|-------------|---------------------------|
| Frontend    | HTML, CSS, JavaScript     |
| Backend     | FastAPI                   |
| Model       | Huggingface GPT-2         |
| Inference   | Transformers + PyTorch    |
| Hosting     | Local or server compatible|

---

![Screenshot 2025-07-01 154125](https://github.com/user-attachments/assets/192ff5e1-23ad-4ef8-8af4-5ac74b2ce76e)
![Screenshot 2025-07-01 154107](https://github.com/user-attachments/assets/5a9a24c3-ec4b-4692-b7da-d763e85f36cc)

---

## 🧠 Model Info

This project uses a fine-tuned GPT-2 model, saved in `output_dir/`. The actual model weights (`model.safetensors`) are **not uploaded to GitHub** because of [GitHub's 100MB file limit](https://drive.google.com/drive/folders/1H-TEmj8sbaqjUP1Ss3lNwugqFcABnxFV?usp=sharing).

You can:

- Fine-tune GPT-2 yourself using Hugging Face
- Or place your own `model.safetensors` in `output_dir/`

---

## ⚙️ How to Run Locally

> Make sure Python 3.8+ and `pip` are installed.

### 1. Clone the Repo

```bash
git clone https://github.com/Jaikumar2406/TextGen-AI.git
cd TextGen-AI
