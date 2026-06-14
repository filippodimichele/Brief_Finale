from sqlalchemy import Column, Integer, Numeric, ForeignKey, DateTime, Table, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from persistence.db_confing import Base

preventivi_optional = Table(
    "preventivi_optional",
    Base.metadata,
    Column("id_preventivo", Integer, ForeignKey("preventivi.id_preventivo", ondelete="CASCADE"), primary_key=True),
    Column("id_optional", Integer, ForeignKey("optional.id_optional", ondelete="RESTRICT"), primary_key=True)
)

class Preventivo(Base):
    __tablename__ = "preventivi"

    id_preventivo = Column(Integer, primary_key=True, autoincrement=True)
    id_utente = Column(Integer, ForeignKey("utenti.id_utente", ondelete="CASCADE"), nullable=False)
    id_abbinamento = Column(Integer, ForeignKey("abbinamenti_catalogo.id_abbinamento", ondelete="RESTRICT"), nullable=False)
    data_creazione = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    prezzo_totale = Column(Numeric(10, 2), nullable=False)
    
    # colonna per la gestione degli stati da parte dell'admin
    stato = Column(String(30), default="in attesa", nullable=False)

    utente = relationship("Utente", back_populates="preventivi")
    abbinamento = relationship("AbbinamentoCatalogo")
    optional_scelti = relationship("Optional", secondary=preventivi_optional)

    def __repr__(self):
        return f"Preventivo(id={self.id_preventivo}, utente={self.id_utente}, totale={self.prezzo_totale}, stato={self.stato})"

    def __str__(self):
        return f"Preventivo #{self.id_preventivo} - Totale: {self.prezzo_totale} - Stato: {self.stato}"

    def to_dict(self):
        return {
            "id_preventivo": self.id_preventivo,
            "id_utente": self.id_utente,
            "id_abbinamento": self.id_abbinamento,
            "data_creazione": self.data_creazione,
            "prezzo_totale": float(self.prezzo_totale),
            "stato": self.stato
        }