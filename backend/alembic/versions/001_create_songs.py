"""create songs table

Revision ID: 001
Revises: 
Create Date: 2024-06-10 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'songs',
        sa.Column('id', sa.Text(), nullable=False),
        sa.Column('title', sa.Text(), nullable=False),
        sa.Column('mode', sa.Integer(), nullable=True),
        sa.Column('acousticness', sa.Float(), nullable=True),
        sa.Column('danceability', sa.Float(), nullable=True),
        sa.Column('energy', sa.Float(), nullable=True),
        sa.Column('instrumentalness', sa.Float(), nullable=True),
        sa.Column('liveness', sa.Float(), nullable=True),
        sa.Column('loudness', sa.Float(), nullable=True),
        sa.Column('speechiness', sa.Float(), nullable=True),
        sa.Column('tempo', sa.Float(), nullable=True),
        sa.Column('valence', sa.Float(), nullable=True),
        sa.Column('duration_ms', sa.Integer(), nullable=True),
        sa.Column('num_sections', sa.Integer(), nullable=True),
        sa.Column('num_segments', sa.Integer(), nullable=True),
        sa.Column('star_rating', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('star_rating >= 1 AND star_rating <= 5', name='star_rating_check')
    )
    op.create_index('idx_songs_title_lower', 'songs', [sa.text('lower(title)')])

def downgrade() -> None:
    op.drop_index('idx_songs_title_lower', table_name='songs')
    op.drop_table('songs')
