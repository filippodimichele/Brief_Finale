from sqlalchemy import Column,Integer ,String, ForeignKey, Table
from sqlalchemy.orm import relationship
from persistence.db_confing import Base


class Utente(Base):
    __tablename__ = "utenti"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(50), nullable=False)
    cognome = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False)
    password = Column(String(200), nullable=False)



    def __repr__(self):
        return f"Utente(id={self.id}, email='{self.email}')"
    

    def __str__(self):
        return f"{self.nome} {self.cognome} ({self.email})"
    
    



