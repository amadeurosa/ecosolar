from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

aplicativo = Flask(__name__)
CORS(aplicativo)

conexao = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Hauptbahnhof581988#",
    database="projeto_ecosolar"
)

@aplicativo.route("/api/geracao", methods=["GET"])
def listar_geracao():
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT * FROM geracao_solar")
    resultado = cursor.fetchall()
    return jsonify(resultado)

@aplicativo.route("/api/consumo", methods=["GET"])
def listar_consumo():
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT * FROM consumo_energia")
    resultado = cursor.fetchall()
    return jsonify(resultado)

if __name__ == "__main__":
    aplicativo.run(host="0.0.0.0", port=5000)
