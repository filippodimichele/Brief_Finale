from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, Table
from sqlalchemy.orm import relationship
from persistence.db_confing import Base

#tabella ponte per la relazione N:M
abbinamenti_optional = Table(
    "abbinamenti_optional",
    Base.metadata,
    Column("id_abbinamento", Integer, ForeignKey("abbimanemnti_catalogo.id_abbinamento"), primary_key=True),
    Column("id_optional", Integer, ForeignKey("optional.id_optional"), primary_key=True)

)

class Optional(Base):
    __tablename__ = "optional"

    id_optional = Column(Integer, primary_key=True)
    nome_optional = Column(String(100), nullable=False)
    categoria = Column(String(50), nullable=False)
    prezzo_standard = Column(Numeric(10,2), nillable=False)

    #relazione N:M con AbbinamentoCatalogo tramite 'abbinamenti_optional
    abbinamenti = relationship(
        "AbbinamentoCatalogo",
        secondary=abbinamenti_optional,
        back_populates="optional_disponibili"
    )

    def __repr__(self):
        return f"Optional(id={self.id_optional}, nome='{self.nome_optional}', prezzo={self.prezzo_standard})"

    def __str__(self):
        return f"{self.nome_optional} ({self.categoria}) - {self.prezzo_standard}€"

    def to_dict(self):
        return {
            "id_optional": self.id_optional,
            "nome_optional": self.nome_optional,
            "categoria": self.categoria,
            "prezzo_standard": float(self.prezzo_standard) if self.prezzo_standard else 0.0
        }

