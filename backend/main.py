import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Librerías de RAG (LangChain & PyPDF)
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

app = FastAPI(title="API RAG - Docentes Perú")

# Permitir solicitudes desde el Frontend en TypeScript
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConsultaRequest(BaseModel):
    pregunta: str

@app.get("/")
def inicio():
    return {"mensaje": "API RAG para Docentes del Perú activa y lista."}

@app.post("/api/rag/consultar")
async def consultar_rag(payload: ConsultaRequest):
    if not payload.pregunta.strip():
        raise HTTPException(status_code=400, detail="La pregunta no puede estar vacía.")
    
    # Aquí se ejecuta la búsqueda sobre el vectorstore y la respuesta del LLM
    # (En la fase de producción conectaremos Pinecone/Chroma y la clave de API)
    
    respuesta_simulada = (
        f"Respuesta generada según la normativa del Minedu para: '{payload.pregunta}'"
    )
    
    return {
        "pregunta": payload.pregunta,
        "respuesta": respuesta_simulada,
        "fuente": "docs/primaria.pdf"
    }