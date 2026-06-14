from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Marchio(db.Model):
    __tablename__ = 'marchi'
    id_marchio = db.Column(db.Integer, primary_key=True)
    nome_marchio = db.Column(db.String(50), nullable=False, unique=True)
    modelli = db.relationship('Modello', backref='marchio_rel', lazy=True)

class Modello(db.Model):
    __tablename__ = 'modelli'
    id_modello = db.Column(db.Integer, primary_key=True)
    nome_modello = db.Column(db.String(50), nullable=False)
    id_marchio = db.Column(db.Integer, db.ForeignKey('marchi.id_marchio', ondelete='CASCADE'), nullable=False)

class Allestimento(db.Model):
    __tablename__ = 'allestimenti'
    id_allestimento = db.Column(db.Integer, primary_key=True)
    nome_allestimento = db.Column(db.String(50), nullable=False)

class Motorizzazione(db.Model):
    __tablename__ = 'motorizzazioni'
    id_motorizzazione = db.Column(db.Integer, primary_key=True)
    nome_motore = db.Column(db.String(50), nullable=False)
    alimentazione = db.Column(db.String(20), nullable=False)
    potenza_cv = db.Column(db.Integer, nullable=False)

class AbbinamentoCatalogo(db.Model):
    __tablename__ = 'catalogo'
    id_abbinamento = db.Column(db.Integer, primary_key=True)
    id_modello = db.Column(db.Integer, db.ForeignKey('modelli.id_modello'), nullable=False)
    id_allestimento = db.Column(db.Integer, db.ForeignKey('allestimenti.id_allestimento'), nullable=False)
    id_motorizzazione = db.Column(db.Integer, db.ForeignKey('motorizzazioni.id_motorizzazione'), nullable=False)
    prezzo_base = db.Column(db.Float, nullable=False)

class Optional(db.Model):
    __tablename__ = 'optional'
    id_optional = db.Column(db.Integer, primary_key=True)
    nome_optional = db.Column(db.String(50), nullable=False)
    prezzo = db.Column(db.Float, nullable=False)