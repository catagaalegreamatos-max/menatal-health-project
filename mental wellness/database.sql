-- Create database
CREATE DATABASE IF NOT EXISTS mental_wellness;

USE mental_wellness;

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stress INT NOT NULL CHECK (stress >= 1 AND stress <= 5),
    anxiety INT NOT NULL CHECK (anxiety >= 1 AND anxiety <= 5),
    sleep INT NOT NULL CHECK (sleep >= 1 AND sleep <= 5),
    mood INT NOT NULL CHECK (mood >= 1 AND mood <= 5),
    social INT NOT NULL CHECK (social >= 1 AND social <= 5),
    physical INT NOT NULL CHECK (physical >= 1 AND physical <= 5),
    pressure INT NOT NULL CHECK (pressure >= 1 AND pressure <= 5),
    irritability INT NOT NULL CHECK (irritability >= 1 AND irritability <= 5),
    concentration INT NOT NULL CHECK (concentration >= 1 AND concentration <= 5),
    hope INT NOT NULL CHECK (hope >= 1 AND hope <= 5),
    notes TEXT,
    overall_score INT NOT NULL,
    wellness_level VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create an index for faster queries
CREATE INDEX idx_created_at ON assessments(created_at);
CREATE INDEX idx_wellness_level ON assessments(wellness_level);
