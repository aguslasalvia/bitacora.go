package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var Database *sql.DB

func init() {
	fmt.Println("Conectando a:", "bitacora.db")

	var err error
	Database, err = sql.Open("sqlite3", "bitacora.db")
	if err != nil {
		log.Fatal("Error creando conexión: ", err)
	}

	// Validar conexión real
	if err := Database.Ping(); err != nil {
		log.Fatal("Error conectando a SQLite: ", err)
	}

	ddl, err := os.ReadFile("scripts/DDL.sql")
	if err != nil {
		log.Fatal("Error leyendo DDL.sql: ", err)
	}

	_, err = Database.Exec(string(ddl))
	if err != nil {
		log.Fatal("Error creando tabla principal: ", err)
	}

	log.Println("✅ Base de datos conectada con éxito y tablas listas")
}
