class DBQuestProgress(Base):
    __tablename__ = "quest_progress"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    module_name = Column(String) # e.g., "CVC-Word-Building"
    progress_percent = Column(Float, default=0.0)
    is_mastered = Column(Boolean, default=False)