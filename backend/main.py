import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Cargar variables de entorno (.env)
load_dotenv()

# LangChain y RAG
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

app = FastAPI(title="API RAG Gratuita - Docentes Perú")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variable global para el pipeline
rag_chain = None

def inicializar_rag():
    global rag_chain
    pdf_path = "docs/primaria.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"⚠️ Advertencia: No se encontró el archivo {pdf_path}")
        return

    print("📄 Cargando PDF del Minedu...")
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()

    # Fragmentar el documento
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    splits = text_splitter.split_documents(docs)

    print("🧠 Creando Embeddings gratuitos (HuggingFace)...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Guardar en base vectorial local
    vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    # Configurar LLM Gratuito (Groq / Llama 3)
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        print("⚠️ GROQ_API_KEY no encontrada en las variables de entorno.")
        return

    llm = ChatGroq(
        groq_api_key=groq_api_key,
        model_name="llama-3.1-8b-instant",
        temperature=0.2
    )

    # Prompt para los profesores del Perú
    system_prompt = (
        "Eres un asistente pedagógico experto en la normativa y Currículo Nacional del Minedu Perú. "
        "Responde a los docentes de forma clara, precisa y profesional basándote únicamente en el contexto proporcionado. "
        "Si la respuesta no se encuentra en el documento, indica amablemente que no tienes esa información específica.\n\n"
        "{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    print("✅ Sistema RAG inicializado con éxito.")

# Cargar el RAG al iniciar la API
@app.on_event("startup")
def startup_event():
    inicializar_rag()

class ConsultaRequest(BaseModel):
    pregunta: str

@app.get("/")
def inicio():
    return {"status": "ok", "mensaje": "API RAG Docentes Perú activa."}

@app.post("/api/rag/consultar")
async def consultar_rag(payload: ConsultaRequest):
    if not payload.pregunta.strip():
        raise HTTPException(status_code=400, detail="La pregunta no puede estar vacía.")
    
    if rag_chain is None:
        raise HTTPException(status_code=500, detail="El sistema RAG no se ha inicializado correctamente.")

    response = rag_chain.invoke({"input": payload.pregunta})
    
    return {
        "pregunta": payload.pregunta,
        "respuesta": response["answer"],
        "fuente": "Currículo Nacional Educación Primaria (Minedu)"
    }
