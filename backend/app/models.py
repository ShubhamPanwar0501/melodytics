from sqlalchemy import Column, Text, Integer, Float, DateTime, func, CheckConstraint
from .core.database import Base

class Song(Base):
    __tablename__ = "songs"

    id               = Column(Text, primary_key=True)
    title            = Column(Text, nullable=False)
    mode             = Column(Integer)
    acousticness     = Column(Float)
    danceability     = Column(Float)
    energy           = Column(Float)
    instrumentalness = Column(Float)
    liveness         = Column(Float)
    loudness         = Column(Float)
    speechiness      = Column(Float)
    tempo            = Column(Float)
    valence          = Column(Float)
    duration_ms      = Column(Integer)
    num_sections     = Column(Integer)
    num_segments     = Column(Integer)
    star_rating      = Column(Integer, nullable=True)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint('star_rating >= 1 AND star_rating <= 5', name='star_rating_check'),
    )
