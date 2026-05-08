import os
from datetime import datetime, timedelta
from typing import List, Optional

import jwt
from passlib.context import CryptContext
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship

# --- DATABASE CONFIGURATION ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./dyslexia_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# --- DATABASE MODELS ---

class DBUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    age = Column(Integer)
    role = Column(String, default="child")

    scores = relationship("DBScore", back_populates="owner")
    quest_progress = relationship("DBQuestProgress", back_populates="owner")


class DBScore(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    test_type = Column(String)
    accuracy_percent = Column(Float)
    risk_level = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("DBUser", back_populates="scores")


class DBQuestProgress(Base):
    __tablename__ = "quest_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    module_name = Column(String)
    progress_percent = Column(Float, default=0.0)
    is_mastered = Column(Boolean, default=False)

    owner = relationship("DBUser", back_populates="quest_progress")


# --- CREATE DATABASE TABLES ---
Base.metadata.create_all(bind=engine)

# --- SECURITY CONFIG ---

PWD_CONTEXT = CryptContext(
    schemes=["sha256_crypt"],
    deprecated="auto"
)

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "HACKATHON_DEMO_KEY_2026"
)

ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/token"
)

# --- FASTAPI APP ---

app = FastAPI(
    title="DyslexiCore Healthcare AI Agent"
)

# --- CORS ---

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE DEPENDENCY ---

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

# --- AUTH DEPENDENCY ---

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[ALGORITHM]
        )

        email: str = payload.get("sub")

    except:
        raise HTTPException(
            status_code=401,
            detail="Invalid session"
        )

    user = db.query(DBUser).filter(
        DBUser.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

# --- SCHEMAS ---

class RegisterRequest(BaseModel):
    email: str
    password: str
    first_name: str
    age: int


class GenericSubmission(BaseModel):
    test_type: str
    accuracy_percent: float


class ChatRequest(BaseModel):
    message: str


# ============================================================
# 1. AUTH ROUTES
# ============================================================

@app.post("/auth/register")
def register(
    req: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = db.query(DBUser).filter(
        DBUser.email == req.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    new_user = DBUser(
        email=req.email,
        hashed_password=PWD_CONTEXT.hash(req.password),
        first_name=req.first_name,
        age=req.age
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "User created successfully"
    }


@app.post("/auth/token")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(DBUser).filter(
        DBUser.email == form_data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not PWD_CONTEXT.verify(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = jwt.encode(
        {
            "sub": user.email,
            "exp": datetime.utcnow() + timedelta(hours=24)
        },
        JWT_SECRET,
        algorithm=ALGORITHM
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/api/user/me")
def get_me(
    current_user: DBUser = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "first_name": current_user.first_name,
        "email": current_user.email
    }

# ============================================================
# 2. ASSESSMENT ROUTES
# ============================================================

@app.post("/api/assessment/submit")
@app.post("/api/screening/submit")
def submit_test(
    sub: GenericSubmission,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):

    risk = (
        "High"
        if sub.accuracy_percent < 50
        else "Moderate"
        if sub.accuracy_percent < 80
        else "Low"
    )

    new_score = DBScore(
        user_id=current_user.id,
        test_type=sub.test_type,
        accuracy_percent=sub.accuracy_percent,
        risk_level=risk
    )

    db.add(new_score)
    db.commit()

    return {
        "risk_level": risk
    }


@app.get("/api/assessment/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):

    return db.query(DBScore).filter(
        DBScore.user_id == current_user.id
    ).all()

# ============================================================
# 3. QUEST ROUTES
# ============================================================

@app.get("/api/quests")
@app.get("/api/skill-quest")
def get_all_quests(
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):

    static_data = [
        {
            "title": "Phoneme Peak",
            "module": "phonics-1"
        },
        {
            "title": "CVC Kingdom",
            "module": "cvc-2"
        },
        {
            "title": "Letter Mirror",
            "module": "mirror-3"
        }
    ]

    output = []

    for item in static_data:

        prog = db.query(DBQuestProgress).filter(
            DBQuestProgress.user_id == current_user.id,
            DBQuestProgress.module_name == item["module"]
        ).first()

        output.append({
            **item,
            "progress": prog.progress_percent if prog else 0
        })

    return output


@app.get("/api/intervention/current")
def get_current_task():

    return {
        "current_module": "Phoneme Peak",
        "status": "In Progress"
    }

# ============================================================
# 4. CHAT ROUTE
# ============================================================

@app.post("/api/chat/gemini")
def local_chat(req: ChatRequest):

    return {
        "response_text": "You are doing amazing! Keep learning step by step."
    }

# ============================================================
# 5. SUPPORT ROUTES
# ============================================================

@app.get("/api/support/resources")
def get_resources():

    return [
        {
            "title": "Dyslexia FAQ",
            "url": "/docs/faq.pdf"
        }
    ]

# ============================================================
# 6. HEALTHCARE AI AGENT ROUTES
# ============================================================

@app.get("/api/fhir/patient/me")
def get_my_fhir_patient(
    current_user: DBUser = Depends(get_current_user)
):

    return {
        "resourceType": "Patient",
        "id": f"child-{current_user.id}",
        "name": [
            {
                "given": [current_user.first_name]
            }
        ],
        "extension": [
            {
                "url": "https://dyslexicore.ai/fhir/StructureDefinition/learning-risk-context",
                "valueString": "Dyslexia screening candidate"
            }
        ]
    }


@app.get("/api/agent/summary")
def get_agent_summary(
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):

    latest_score = (
        db.query(DBScore)
        .filter(DBScore.user_id == current_user.id)
        .order_by(DBScore.created_at.desc())
        .first()
    )

    if not latest_score:

        return {
            "agent": "DyslexiCore Agent",
            "patient_context": {
                "id": f"child-{current_user.id}",
                "name": current_user.first_name
            },
            "assessment": "No assessment submitted yet.",
            "recommendation": "Complete the screening first."
        }

    return {
        "agent": "DyslexiCore Agent",

        "patient_context": {
            "resourceType": "Patient",
            "id": f"child-{current_user.id}",
            "name": current_user.first_name
        },

        "assessment": {
            "test_type": latest_score.test_type,
            "accuracy_percent": latest_score.accuracy_percent,
            "risk_level": latest_score.risk_level
        },

        "detected_indicators": [
            "phoneme confusion",
            "letter reversal tendency",
            "slow decoding speed"
        ],

        "recommendation":
            "Start Phoneme Peak and Letter Mirror intervention quests.",

        "interoperability": {
            "FHIR_ready": True,
            "A2A_ready": True,
            "Prompt_Opinion_ready": True
        }
    }


@app.get("/api/agent/card")
def get_agent_card():

    return {
        "name": "DyslexiCore Agent",

        "description":
            "Healthcare AI agent for early dyslexia screening and intervention.",

        "version": "1.0.0",

        "capabilities": [
            "FHIR patient context",
            "dyslexia risk scoring",
            "phoneme confusion detection",
            "intervention recommendation",
            "parent dashboard summary"
        ]
    }