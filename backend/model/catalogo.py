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


class Motorizzazione(Base):
    __tablename__ = "motorizzazioni"

    id_motorizzazione = Column(Integer, primary_key=True, autoincrement=True)
    nome_motore = Column(String(50), nullable=False)
    alimentazione = Column(String(30), nullable=False)
    potenza_cv = Column(Integer, nullable=False)

    abbinamenti = relationship("AbbinamentoCatalogo", back_populates="motorizzazione")

    def to_dict(self):  #converte l'oggetto nel database in un dizionario python per permetterela serializzazione n formato JSON nelle rotte API
        return {
            "id_motorizzazione": self.id_motorizzazione,
            "nome_motore": self.nome_motore,
            "alimentazione": self.alimentazione,
            "potenza_cv": self.potenza_cv
        }


class AbbinamentoCatalogo(Base):
    
    __tablename__ = "abbinamenti_catalogo"
    __table_args__ = (UniqueConstraint('id_modello', 'id_allestimento', 'id_motorizzazione', name='uq_abbinamento'),)

    id_abbinamento = Column(Integer, primary_key=True, autoincrement=True)
    id_modello = Column(Integer, ForeignKey("modelli.id_modello", ondelete="CASCADE"), nullable=False)
    id_allestimento = Column(Integer, ForeignKey("allestimenti.id_allestimento"), nullable=False)
    id_motorizzazione = Column(Integer, ForeignKey("motorizzazioni.id_motorizzazione"), nullable=False)
    prezzo_base = Column(Numeric(10, 2), nullable=False),
    optional_disponibili = relationship(
    "Optional",
    secondary="abbinamenti_optional",
    back_populates="abbinamenti"
)

    allestimento = relationship("Allestimento", back_populates="abbinamenti")
    motorizzazione = relationship("Motorizzazione", back_populates="abbinamenti")

    def to_dict(self):
        return {
            "id_abbinamento": self.id_abbinamento,
            "id_modello": self.id_modello,
            "id_allestimento": self.id_allestimento,
            "id_motorizzazione": self.id_motorizzazione,
            "prezzo_base": float(self.prezzo_base) if self.prezzo_base else 0.0,
            
        }