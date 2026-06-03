from sqlalchemy import Column, String, Table, ForeignKey
from persistence.db_confing import Base


class Catalogo (Base):
    __tablename__ = "allestimenti"


id = Column(Integrer, primary_key=True, autoincrement=True)
nome_allestimento = Column(String(50), nullable=False, unique=True)

abbinamenti = Column(String(50))
