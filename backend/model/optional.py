from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.orm import relationship
from persistence.db_confing import Base

class Optional(Base):
    __tablename__ = "optional"

    id_optional = Column(Integer, primary_key=True, autoincrement=True)
    nome_optional = Column(String(100), nullable=False)
    prezzo = Column(Numeric(10, 2), nullable=False)

    # relazione molti-a-molti con gli abbinamenti
    abbinamenti = relationship("AbbinamentoCatalogo", secondary="abbinamenti_optional", back_populates="optional_disponibili")

    def to_dict(self):
        # converte l'optional in dizionario per la serializzazione
        return {
            "id_optional": self.id_optional,
            "nome_optional": self.nome_optional,
            "prezzo": float(self.prezzo)
        }