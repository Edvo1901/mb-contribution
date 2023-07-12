CREATE TABLE Contribution (
    citizenid VARCHAR(255) NOT NULL,
    user VARCHAR(255) NOT NULL,
    totalMoney INT NOT NULL DEFAULT 0,
    PRIMARY KEY (citizenId)
);
