import mysql.connector

conexao = mysql.connector.connect(
    host="localhost",
    user="root",
    password="-------------",
    database="projeto_ecosolar"
)

cursor = conexao.cursor()

# Inserir dados na tabela geracao_solar
dados_geracao = [
    ("2025-04-21", 120.50),
    ("2025-04-22", 130.20),
    ("2025-04-23", 110.75),
    ("2025-04-24", 125.10),
    ("2025-04-25", 140.00)
]

for data, energia in dados_geracao:
    cursor.execute("INSERT INTO geracao_solar (data_registro, energia_gerada) VALUES (%s, %s)", (data, energia))

# Inserir dados na tabela consumo_energia
dados_consumo = [
    ("2025-04-21", 100.30),
    ("2025-04-22", 115.50),
    ("2025-04-23", 105.20),
    ("2025-04-24", 120.10),
    ("2025-04-25", 130.40)
]

for data, energia in dados_consumo:
    cursor.execute("INSERT INTO consumo_energia (data_registro, energia_consumida) VALUES (%s, %s)", (data, energia))

# Salvar as mudanças no banco
conexao.commit()

# Fechar conexão
cursor.close()
conexao.close()

print("Dados inseridos com sucesso!")
