"""Rename name to title and add missing columns

Revision ID: ad21a6b25f74
Revises: 36491e6189b1
Create Date: 2025-02-07 13:47:52.457724

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ad21a6b25f74'
down_revision: Union[str, None] = '36491e6189b1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('campaigns', sa.Column('title', sa.String(), nullable=False))
    op.add_column('campaigns', sa.Column('description', sa.String(), nullable=False))
    op.add_column('campaigns', sa.Column('start_date', sa.Date(), nullable=False))
    op.add_column('campaigns', sa.Column('end_date', sa.Date(), nullable=False))
    op.drop_index('ix_campaigns_name', table_name='campaigns')
    op.create_index(op.f('ix_campaigns_title'), 'campaigns', ['title'], unique=False)
    op.drop_column('campaigns', 'name')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('campaigns', sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_index(op.f('ix_campaigns_title'), table_name='campaigns')
    op.create_index('ix_campaigns_name', 'campaigns', ['name'], unique=False)
    op.drop_column('campaigns', 'end_date')
    op.drop_column('campaigns', 'start_date')
    op.drop_column('campaigns', 'description')
    op.drop_column('campaigns', 'title')
    # ### end Alembic commands ###
