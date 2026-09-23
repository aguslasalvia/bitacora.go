package models

import (
	"bitacora/internal/config"
	"bitacora/internal/core"
	"time"
)

func AddRecord(record core.Record) error {
	_, err := config.Database.Exec(`
		INSERT INTO records (name, lab, endUser, equipment, startDateTime, endDateTime,
			received, returned, comments, timestamp)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		record.Name,
		record.Lab,
		record.EndUser,
		record.Equipment,
		record.StartDateTime,
		record.EndDateTime,
		record.Received,
		record.Returned,
		record.Comments,
		int(time.Now().Unix()),
	)

	return err
}

func GetRecordByID(id string) (core.Record, error) {
	var record core.Record

	row := config.Database.QueryRow(`
        SELECT id, name, lab, endUser, equipment, startDateTime, endDateTime,
               received, returned, comments, timestamp
        FROM records
        WHERE id = ?;
    `, id)

	err := row.Scan(
		&record.ID,
		&record.Name,
		&record.Lab,
		&record.EndUser,
		&record.Equipment,
		&record.StartDateTime,
		&record.EndDateTime,
		&record.Received,
		&record.Returned,
		&record.Comments,
		&record.Timestamp,
	)
	if err != nil {
		return core.Record{}, err
	}

	return record, nil
}

func GetRecordByMachine(machine string, limit int) ([]core.Record, error) {
	if limit <= 0 {
		limit = -1 // If the client sends 0 it means that want's all records of that machine
	}
	rows, err := config.Database.Query(`
		SELECT  id, name, lab, endUser, equipment, startDateTime, endDateTime,
			received, returned, comments, timestamp
		FROM records
		WHERE equipment = ?
		ORDER BY startDateTime DESC
		LIMIT ?;
	`, machine, limit)

	if err != nil || rows.Err() != nil {
		return nil, err
	}

	defer rows.Close()

	var records []core.Record
	for rows.Next() {
		var r core.Record
		err := rows.Scan(
			&r.ID,
			&r.Name,
			&r.Lab,
			&r.EndUser,
			&r.Equipment,
			&r.StartDateTime,
			&r.EndDateTime,
			&r.Received,
			&r.Returned,
			&r.Comments,
			&r.Timestamp,
		)
		if err != nil {
			return nil, err
		}
		records = append(records, r)
	}
	return records, nil
}
