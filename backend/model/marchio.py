from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from persistence.db_confing import Base

class Marchio(Base):
    __tablename__ = "marchi"

    id_marchio = Column(Integer, primary_key=True, autoincrement=True)
    nome_marchio = Column(String(50), nullable=False, unique=True)
    paese_origine = Column(String(50), nullable=False)

    modelli = relationship("Modello", back_populates="marchio")

    def to_dict(self):
        return {
            "id_marchio": self.id_marchio,
            "nome_marchio": self.nome_marchio,
            "paese_origine": self.paese_origine
        }