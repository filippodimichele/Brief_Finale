from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from persistence.db_confing import Base

class Modello(Base):
    __tablename__ = "modelli"

    id_modello = Column(Integer, primary_key=True, autoincrement=True)
    id_marchio = Column(Integer, ForeignKey("marchi.id_marchio"), nullable=False)
    nome_modello = Column(String(50), nullable=False)

    # relazioni
    marchio = relationship("Marchio", back_populates="modelli")

    def to_dict(self):
        # converte il modello in dizionario
        return {
            "id_modello": self.id_modello,
            "id_marchio": self.id_marchio,
            "nome_modello": self.nome_modello
        }