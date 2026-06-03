from sqlalchemy import Column,Integer,String, ForeignKey
from sqlalchemy.orm import relationship
from persistence.db_confing import Base


class Modello(Base):
    __tablename__ = "modelli"


    id_modello = Column(Integer,primary_key=True,autoincrement=True)
    nome_modello = Column(String(50), nullable=False)
    id_marchio = Column(Integer, ForeignKey("marchi.id_marchio"))

   #relazione N:1
    marchio = relationship("Marchio", back_populates="modelli")


    #relazione 1:N
    abbinamenti = relationship("AbbinamentoCatologo", back_populates="modello")


    def __repr__(self):
        return f"Modello(id={self.id_modello}, nome='{self.nome_modello}', id_marchio={self.id_marchio})"

    def __str__(self):
        return f"{self.nome_modello}"

    def to_dict(self):
        return {
            "id_modello": self.id_modello,
            "nome_modello": self.nome_modello,
            "id_marchio": self.id_marchio
        }






