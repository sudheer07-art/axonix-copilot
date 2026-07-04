from app.database.database import engine, Base
from app.database.models import User

Base.metadata.create_all(bind=engine)

print("✅ Tables Created Successfully")