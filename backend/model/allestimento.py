from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, UniqueConstraint  #unique serve a definire una regola (vincolo) direttamente all'interno delle tabelle db
from sqlalchemy.orm import relationship  #relationship serve apython per per navigare tra gli oggetti collegati
from persistence.db_confing import Base



class Allestimento(Base):
    __tablename__ = "allestimenti"

    id_allestimento = Column(Integer, primary_key=True, autoincrement=True)
    nome_allestimento = Column(String(50), nullable=False, unique=True)

    abbinamenti = relationship("AbbinamentoCatalogo", back_populates="allestimento")

    def to_dict(self):
        return {
            "id_allestimento": self.id_allestimento,
            "nome_allestimento": self.nome_allestimento
        }