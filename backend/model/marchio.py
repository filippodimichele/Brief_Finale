from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from persistence.db_confing import Base

class Marchio(Base):
    __table__ = "marchi"

    id_marchio = Column(Integer, primary_key=True, autoincrement=True)
    nome_marchio = Column(String(50), nullable=False, unique=True)

    #modelli ha una relazione 1:N
    modelli = relationship("Modello", back_populates="marchio")



    def __repr__(self):
        return f"Marchio(id={self.id_marchio}, nome'{self.nome_marchio}')"
    
    def __str__(self):
        return f"{self.nome_marchio}"
    
  
