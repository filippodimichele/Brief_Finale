from sqlalchemy import Column, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from persistence.db_confing import Base

# tabella ponte per la relazione molti-a-molti tra configurazioni e optional
configurazioni_optional = Table(
    "configurazioni_optional",
    Base.metadata,
    Column("id_configurazione", ForeignKey("configurazioni.id_configurazione"), primary_key=True),
    Column("id_optional", ForeignKey("optional.id_optional"), primary_key=True)
)

class Configurazione(Base):
    __tablename__ = "configurazioni"

    # definizione delle colonne (Prima la Primary Key)
    id_configurazione = Column(Integer, primary_key=True, autoincrement=True)
    id_utente = Column(Integer, ForeignKey("utenti.id_utente"), nullable=False)
    id_abbinamento = Column(Integer, ForeignKey("abbinamenti_catalogo.id_abbinamento"), nullable=False)

    # relazioni (Definite una sola volta)
    utente = relationship("Utente", back_populates="configurazioni")
    abbinamento = relationship("AbbinamentoCatalogo")
    optional_scelti = relationship("Optional", secondary=configurazioni_optional)

    def to_dict(self):
            
        return {
            "id_configurazione": self.id_configurazione,
            "id_utente": self.id_utente,
            "id_abbinamento": self.id_abbinamento,
            "optional_scelti": [opt.id_optional for opt in self.optional_scelti]
        }