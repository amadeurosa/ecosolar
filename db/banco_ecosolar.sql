CREATE DATABASE IF NOT EXISTS ecosolar;

USE ecosolar;

CREATE TABLE geracao_solar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_registro DATE NOT NULL,
    energia_gerada DECIMAL(10,2) NOT NULL
);

CREATE TABLE consumo_energia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_registro DATE NOT NULL,
    energia_consumida DECIMAL(10,2) NOT NULL
);