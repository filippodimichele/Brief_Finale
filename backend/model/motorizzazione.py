from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from persistence.db_confing import Base

class Motorizzazione(Base):
    __tablename__ = "motorizzazioni"

    id_motorizzazione = Column(Integer, primary_key=True, autoincrement=True)
    nome_motore = Column(String(50), nullable=False)
    alimentazione = Column(String(30), nullable=False)
    potenza_cv = Column(Integer, nullable=False)

    # relazione con l'abbinamento catalogo
    abbinamenti = relationship("AbbinamentoCatalogo", back_populates="motorizzazione")

    def to_dict(self):
        # converte l'oggetto in un dizionario per la serializzazione json
        return {
            "id_motorizzazione": self.id_motorizzazione,
            "nome_motore": self.nome_motore,
            "alimentazione": self.alimentazione,
            "potenza_cv": self.potenza_cv
        }