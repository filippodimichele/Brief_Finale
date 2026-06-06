from sqlalchemy import Column, Integer, ForeignKey, Numeric, Table, UniqueConstraint
from sqlalchemy.orm import relationship
from persistence.db_confing import Base

# tabella ponte per la relazione molti-a-molti tra abbinamenti e optional
abbinamenti_optional = Table(
    "abbinamenti_optional",
    Base.metadata,
    Column("id_abbinamento", ForeignKey("abbinamenti_catalogo.id_abbinamento"), primary_key=True),
    Column("id_optional", ForeignKey("optional.id_optional"), primary_key=True)
)

class AbbinamentoCatalogo(Base):
    __tablename__ = "abbinamenti_catalogo"
    __table_args__ = (UniqueConstraint('id_modello', 'id_allestimento', 'id_motorizzazione', name='uq_abbinamento'),)

    id_abbinamento = Column(Integer, primary_key=True, autoincrement=True)
    id_modello = Column(Integer, ForeignKey("modelli.id_modello", ondelete="CASCADE"), nullable=False)
    id_allestimento = Column(Integer, ForeignKey("allestimenti.id_allestimento"), nullable=False)
    id_motorizzazione = Column(Integer, ForeignKey("motorizzazioni.id_motorizzazione"), nullable=False)
    prezzo_base = Column(Numeric(10, 2), nullable=False)

    # relazioni
    optional_disponibili = relationship("Optional", secondary=abbinamenti_optional, back_populates="abbinamenti")
    allestimento = relationship("Allestimento", back_populates="abbinamenti")
    motorizzazione = relationship("Motorizzazione", back_populates="abbinamenti")

    def to_dict(self):
        # converte l'abbinamento in dizionario
        return {
            "id_abbinamento": self.id_abbinamento,
            "id_modello": self.id_modello,
            "id_allestimento": self.id_allestimento,
            "id_motorizzazione": self.id_motorizzazione,
            "prezzo_base": float(self.prezzo_base)
        }