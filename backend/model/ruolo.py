from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from persistence.db_confing import Base

class Ruolo(Base):
    __tablename__ = "ruoli"

    id_ruolo = Column(Integer, primary_key=True, autoincrement=True)
    nome_ruolo = Column(String(50), nullable=False)
    
    utenti = relationship("Utente", back_populates="ruolo")

    def __repr__(self):
        return f"Ruolo(id={self.id_ruolo}, nome='{self.nome_ruolo}')"

    def __str__(self):
        return f"{self.nome_ruolo}"

    def to_dict(self):
        return {
            "id_ruolo": self.id_ruolo,
            "nome_ruolo": self.nome_ruolo
        }