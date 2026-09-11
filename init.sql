CREATE DATABASE IF NOT EXISTS melanie_marin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE melanie_marin_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('FACIAL', 'CORPORAL') NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    duration_min INT DEFAULT 45,
    highlight BOOLEAN DEFAULT FALSE
);

INSERT INTO services (category, title, description, duration_min, highlight) VALUES
('FACIAL', 'Punta de Diamante', 'Exfoliación profunda no invasiva.', 50, true),
('FACIAL', 'Hidrafacial', 'Limpieza profunda e hidratación.', 60, true),
('FACIAL', 'Dermapen con Vitaminas', 'Microneedling con cóctel vitamínico.', 60, false),
('FACIAL', 'Dermapen Exosomas y ADN Salmón', 'Terapia celular avanzada.', 75, true),
('FACIAL', 'Tratamiento Vitamina C', 'Luminosidad y antioxidante.', 50, false),
('FACIAL', 'Tratamiento Antimanchas', 'Protocolo despigmentante.', 60, false),
('FACIAL', 'Tratamiento Ojeras', 'Drenaje y revitalización.', 45, false),
('FACIAL', 'Tratamiento Antiarrugas', 'Redensificación dérmica.', 60, false),
('FACIAL', 'Hollywood Peel', 'Peeling láser con carbón activo.', 45, true),
('FACIAL', 'Masaje Craneofacial', 'Descompresión muscular.', 40, false),
('FACIAL', 'Láser Facial SHR', 'Depilación y rejuvenecimiento.', 30, false),
('CORPORAL', 'Maderoterapia', 'Modelado corporal holístico.', 60, true),
('CORPORAL', 'Drenaje Linfático Manual', 'Eliminación de toxinas.', 60, false),
('CORPORAL', 'Presoterapia', 'Estimulación circulatoria.', 45, false),
('CORPORAL', 'Masaje Relajante (30 min)', 'Alivio express de tensión.', 30, false),
('CORPORAL', 'Masaje Relajante y Descontracturante (60 min)', 'Trabajo profundo.', 60, true),
('CORPORAL', 'Láser Corporal SHR', 'Depilación corporal.', 45, false),
('CORPORAL', 'Eliminación de Estrías', 'Regeneración tisular.', 60, false);