// Mirrors internal/core.Record's JSON shape (Go has no json tags, so field
// names are marshalled verbatim as exported Go identifiers).
export interface Record {
  ID: number;
  Name: string;
  Lab: string;
  EndUser: string;
  Equipment: string;
  StartDateTime: number;
  EndDateTime: number;
  Received: boolean;
  Returned: boolean;
  Comments: string;
  Timestamp: number;
}

// Response shape of GET /records/open?id=
export interface RecordDetail {
  Record: Record;
  Start: string;
  End: string;
}
