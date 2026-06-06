-- Migration: add cost tracking columns to work_orders
-- Run once in the Neon SQL editor

ALTER TABLE work_orders
  ADD COLUMN IF NOT EXISTS base_cost     NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS labor_rate    NUMERIC(12,2) DEFAULT 3500,
  ADD COLUMN IF NOT EXISTS total_cost    NUMERIC(12,2);
