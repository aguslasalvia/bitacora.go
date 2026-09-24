package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"bitacora/internal/core"
	"bitacora/internal/models"

	"github.com/gin-gonic/gin"
)

type RecordController struct{}

func NewRecordController() *RecordController {
	return &RecordController{}
}

func (rc *RecordController) AddRecord(c *gin.Context) {
	var incomingRecord core.Record

	if err := c.ShouldBindJSON(&incomingRecord); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campos Invalidos"})
		return
	}

	err := models.AddRecord(incomingRecord)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear registro"})
		return
	}

	c.JSON(http.StatusCreated, nil)
}

func (rc *RecordController) GetRecordByID(c *gin.Context) {
	id := c.Query("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No se ha ingresado ningun ID para buscar"})
		return
	}

	record, err := models.GetRecordByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "NO se econtraron registros para ese equipo"})
		return
	}

	start := time.UnixMilli(record.StartDateTime).Format("02/01/2006 15:04")

	var end string
	if record.EndDateTime != 0 {
		end = time.UnixMilli(record.EndDateTime).Format("02/01/2006 15:04")
	} else {
		end = "" // no mostrar nada
	}

	c.JSON(http.StatusOK, gin.H{
		"Record": record,
		"Start":  start,
		"End":    end,
	})
}

func (rc *RecordController) GetRecordByMachine(c *gin.Context) {
	machineType := c.Query("type")

	limitStr := c.Query("limit")

	limit := 10
	if limitStr != "" {
		parsed, err := strconv.Atoi(limitStr)
		if err != nil || parsed < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro 'limit' debe ser un número válido"})
			return
		}
		limit = parsed
	}

	records, err := models.GetRecordByMachine(machineType, limit)
	if err != nil {
		fmt.Print("Error al obtener registros por máquina: ", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "NO se econtraron registros para ese equipo"})
		return
	}
	c.JSON(http.StatusOK, records)
}

func (rc *RecordController) GetNewRecord(c *gin.Context) {
	go sendEmail()
}

func sendEmail() bool {
	return true
}
