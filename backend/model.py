from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()



class Marchio(db.Model):
    __tablename__ = 'marchi'  
    
    id_marchio = db.Column(db.Integer, primary_key=True)
    nome_marchio = db.Column(db.String(50), nullable=False, unique=True)
    
   
    modelli = db.relationship('Modello', backref='marchio_rel', lazy=True)

    def to_dict(self):
        return {
            "id_marchio": self.id_marchio,
            "nome_marchio": self.nome_marchio
        }


class Modello(db.Model):
    __tablename__ = 'modelli'
    
    id_modello = db.Column(db.Integer, primary_key=True)
    nome_modello = db.Column(db.String(50), nullable=False)
    
    # chiave Esterna (Foreign Key)
    id_marchio = db.Column(db.Integer, db.ForeignKey('marchi.id_marchio', ondelete='CASCADE'), nullable=False)

    def to_dict(self):
        return {
            "id_modello": self.id_modello,
            "nome_modello": self.nome_modello,
            "id_marchio": self.id_marchio
        }