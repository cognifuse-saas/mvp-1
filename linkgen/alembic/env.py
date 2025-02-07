from alembic import context
from sqlalchemy import engine_from_config, pool
from dotenv import load_dotenv
import os

# Import Base and all models
from database.db_session import Base
from campaigns.models.campaign import CampaignModel

# Load environment variables
load_dotenv()

# Set metadata
target_metadata = Base.metadata

# Update Alembic config dynamically
config = context.config
config.set_main_option(
    "sqlalchemy.url",
    f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
)

# Offline migration
def run_migrations_offline():
    context.configure(url=config.get_main_option("sqlalchemy.url"), literal_binds=True, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

# Online migration
def run_migrations_online():
    engine = engine_from_config(config.get_section(config.config_ini_section), prefix="sqlalchemy.", poolclass=pool.NullPool)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
