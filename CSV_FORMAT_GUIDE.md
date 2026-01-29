# CSV Upload Format Guide

This guide explains the CSV formats required for uploading jobs and downtime data in **Industry Mode**.

---

## Jobs CSV Format

### Required Columns:
- `job_id` - Unique identifier for the job (e.g., J001, J002)
- `product_type` - Pharmaceutical product name (e.g., Paracetamol_500mg, Ibuprofen_400mg)
- `machine_options` - Semicolon-separated list of compatible machines (e.g., M1;M2;M4)
- `processing_time` - Duration in minutes (integer)
- `priority` - Either "Rush" or "Normal" (required for proper optimization)
- `due_time` - Deadline in HH:MM format (e.g., 11:30) (required for tardiness calculation)

### Example (sample_jobs.csv):
```csv
job_id,product_type,machine_options,processing_time,priority,due_time
J001,Paracetamol_500mg,M1;M2;M4,45,Normal,11:30
J002,Ibuprofen_400mg,M1;M3,60,Rush,10:00
J003,Amoxicillin_250mg,M2;M3,50,Normal,12:00
```

---

## Downtime CSV Format

### Required Columns:
- `machine_id` - Machine identifier (e.g., M1, M2, M3)
- `start_time` - Downtime start in HH:MM format (e.g., 10:30)
- `end_time` - Downtime end in HH:MM format (e.g., 11:00)

### Optional Columns:
- `reason` - Description of downtime (default: "Maintenance")
  - Suggested values: Equipment Cleaning, Maintenance, Quality Calibration, Sterilization, Unexpected Breakdown

### Example (sample_downtime.csv):
```csv
machine_id,start_time,end_time,reason
M2,10:30,11:00,Equipment Cleaning
M3,13:00,13:45,Quality Calibration
```

---

## Product Types

The system supports these pharmaceutical products (or custom ones):
- `Paracetamol_500mg`
- `Ibuprofen_400mg`
- `Amoxicillin_250mg`
- `Aspirin_75mg`
- `Metformin_500mg`

---

## Machine Naming

Machines should be named in the format: `M1`, `M2`, `M3`, etc.

The `machine_options` field uses semicolon (`;`) as a separator. Example:
- Single machine: `M1`
- Multiple machines: `M1;M2;M3`

---

## Time Format

All times must be in 24-hour format: `HH:MM`
- Valid: `08:00`, `14:30`, `16:00`
- Invalid: `8:00`, `2:30 PM`

---

## Notes

- CSV files must have headers (first row with column names)
- Times should be within shift hours (default: 08:00 - 16:00)
- All job IDs must be unique
- Machine IDs must match between jobs and downtimes
- Rush jobs should have reasonable deadlines
