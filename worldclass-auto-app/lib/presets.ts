export interface ServicePreset {
  id: string;
  category: string;
  name: string;
  estimated_hours: number;
  base_cost: number;      // JMD flat cost (parts + standard labour included)
  labor_rate: number;     // JMD per hour for any time beyond estimated_hours
}

export const SERVICE_PRESETS: ServicePreset[] = [
  // ── Maintenance ───────────────────────────────────────────
  { id: 'oil-change',          category: 'Maintenance',       name: 'Oil & Filter Change',                 estimated_hours: 0.5, base_cost:  4500, labor_rate: 3500 },
  { id: 'oil-change-syn',      category: 'Maintenance',       name: 'Synthetic Oil & Filter Change',       estimated_hours: 0.5, base_cost:  7500, labor_rate: 3500 },
  { id: 'air-filter',          category: 'Maintenance',       name: 'Air Filter Replacement',              estimated_hours: 0.5, base_cost:  2000, labor_rate: 3500 },
  { id: 'fuel-filter',         category: 'Maintenance',       name: 'Fuel Filter Replacement',             estimated_hours: 0.5, base_cost:  3000, labor_rate: 3500 },
  { id: 'spark-plugs',         category: 'Maintenance',       name: 'Spark Plug Replacement',              estimated_hours: 1.0, base_cost:  5500, labor_rate: 3500 },
  { id: 'pcv-valve',           category: 'Maintenance',       name: 'PCV Valve Replacement',               estimated_hours: 0.5, base_cost:  2500, labor_rate: 3500 },
  { id: 'full-service',        category: 'Maintenance',       name: 'Full Vehicle Service',                estimated_hours: 3.0, base_cost: 14000, labor_rate: 3500 },

  // ── Brakes ────────────────────────────────────────────────
  { id: 'brake-pads-front',    category: 'Brake System',      name: 'Front Brake Pads Replacement',        estimated_hours: 1.0, base_cost:  6000, labor_rate: 3500 },
  { id: 'brake-pads-rear',     category: 'Brake System',      name: 'Rear Brake Pads Replacement',         estimated_hours: 1.0, base_cost:  6000, labor_rate: 3500 },
  { id: 'brake-pads-all',      category: 'Brake System',      name: 'All Brake Pads (4 corners)',          estimated_hours: 2.0, base_cost: 11000, labor_rate: 3500 },
  { id: 'brake-rotors-front',  category: 'Brake System',      name: 'Front Rotors & Pads',                 estimated_hours: 1.5, base_cost: 16000, labor_rate: 3500 },
  { id: 'brake-rotors-rear',   category: 'Brake System',      name: 'Rear Rotors & Pads',                  estimated_hours: 1.5, base_cost: 16000, labor_rate: 3500 },
  { id: 'brake-fluid',         category: 'Brake System',      name: 'Brake Fluid Flush',                   estimated_hours: 0.5, base_cost:  3000, labor_rate: 3500 },
  { id: 'brake-caliper',       category: 'Brake System',      name: 'Brake Caliper Replacement (per)',     estimated_hours: 2.0, base_cost: 13000, labor_rate: 3500 },
  { id: 'hand-brake',          category: 'Brake System',      name: 'Hand Brake Cable Adjustment',         estimated_hours: 0.5, base_cost:  2000, labor_rate: 3500 },

  // ── Tyres & Alignment ─────────────────────────────────────
  { id: 'tire-rotation',       category: 'Tyres & Alignment', name: 'Tyre Rotation',                       estimated_hours: 0.5, base_cost:  2000, labor_rate: 3500 },
  { id: 'tire-balance',        category: 'Tyres & Alignment', name: 'Tyre Balancing (4 wheels)',           estimated_hours: 0.5, base_cost:  3000, labor_rate: 3500 },
  { id: 'wheel-alignment',     category: 'Tyres & Alignment', name: 'Wheel Alignment (4-wheel)',           estimated_hours: 1.0, base_cost:  5500, labor_rate: 3500 },
  { id: 'tire-mount',          category: 'Tyres & Alignment', name: 'Tyre Mounting (per tyre)',            estimated_hours: 0.3, base_cost:  1200, labor_rate: 3500 },
  { id: 'puncture-repair',     category: 'Tyres & Alignment', name: 'Puncture Repair',                     estimated_hours: 0.5, base_cost:  1500, labor_rate: 3500 },

  // ── Engine ────────────────────────────────────────────────
  { id: 'engine-diag',         category: 'Engine',            name: 'Engine Diagnostics (Scan)',           estimated_hours: 1.5, base_cost:  5000, labor_rate: 3500 },
  { id: 'timing-belt',         category: 'Engine',            name: 'Timing Belt Replacement',             estimated_hours: 4.0, base_cost: 26000, labor_rate: 3500 },
  { id: 'timing-chain',        category: 'Engine',            name: 'Timing Chain Kit Replacement',        estimated_hours: 6.0, base_cost: 40000, labor_rate: 3500 },
  { id: 'coolant-flush',       category: 'Engine',            name: 'Coolant Flush & Fill',                estimated_hours: 0.5, base_cost:  3500, labor_rate: 3500 },
  { id: 'thermostat',          category: 'Engine',            name: 'Thermostat Replacement',              estimated_hours: 1.5, base_cost:  6500, labor_rate: 3500 },
  { id: 'water-pump',          category: 'Engine',            name: 'Water Pump Replacement',              estimated_hours: 3.0, base_cost: 18000, labor_rate: 3500 },
  { id: 'head-gasket',         category: 'Engine',            name: 'Head Gasket Replacement',             estimated_hours: 8.0, base_cost: 48000, labor_rate: 3500 },
  { id: 'engine-mount',        category: 'Engine',            name: 'Engine Mount Replacement',            estimated_hours: 2.0, base_cost: 10000, labor_rate: 3500 },
  { id: 'valve-cover',         category: 'Engine',            name: 'Valve Cover Gasket Replacement',      estimated_hours: 1.5, base_cost:  7000, labor_rate: 3500 },

  // ── Transmission ──────────────────────────────────────────
  { id: 'trans-fluid',         category: 'Transmission',      name: 'Transmission Fluid Change',          estimated_hours: 1.0, base_cost:  6000, labor_rate: 3500 },
  { id: 'trans-service',       category: 'Transmission',      name: 'Automatic Transmission Service',     estimated_hours: 2.0, base_cost: 13000, labor_rate: 3500 },
  { id: 'clutch',              category: 'Transmission',      name: 'Clutch Kit Replacement',             estimated_hours: 5.0, base_cost: 32000, labor_rate: 3500 },
  { id: 'cv-axle',             category: 'Transmission',      name: 'CV Axle / Drive Shaft Replacement',  estimated_hours: 2.5, base_cost: 18000, labor_rate: 3500 },
  { id: 'cv-boot',             category: 'Transmission',      name: 'CV Boot Replacement (per)',          estimated_hours: 1.5, base_cost:  7000, labor_rate: 3500 },

  // ── Suspension & Steering ─────────────────────────────────
  { id: 'shock-front',         category: 'Suspension',        name: 'Front Shock Absorbers (pair)',        estimated_hours: 2.0, base_cost: 13000, labor_rate: 3500 },
  { id: 'shock-rear',          category: 'Suspension',        name: 'Rear Shock Absorbers (pair)',         estimated_hours: 2.0, base_cost: 13000, labor_rate: 3500 },
  { id: 'strut-front',         category: 'Suspension',        name: 'Front Strut Assembly Replacement',   estimated_hours: 3.0, base_cost: 22000, labor_rate: 3500 },
  { id: 'tie-rod',             category: 'Suspension',        name: 'Tie Rod End Replacement (per)',       estimated_hours: 1.5, base_cost:  7500, labor_rate: 3500 },
  { id: 'ball-joint',          category: 'Suspension',        name: 'Ball Joint Replacement (per)',        estimated_hours: 2.0, base_cost: 10000, labor_rate: 3500 },
  { id: 'bushing',             category: 'Suspension',        name: 'Control Arm Bushing (pair)',          estimated_hours: 2.0, base_cost:  9000, labor_rate: 3500 },
  { id: 'control-arm',         category: 'Suspension',        name: 'Control Arm Replacement (per)',       estimated_hours: 2.5, base_cost: 18000, labor_rate: 3500 },
  { id: 'power-steering-fluid',category: 'Suspension',        name: 'Power Steering Fluid Flush',         estimated_hours: 0.5, base_cost:  2500, labor_rate: 3500 },
  { id: 'rack-pinion',         category: 'Suspension',        name: 'Rack & Pinion Replacement',          estimated_hours: 4.0, base_cost: 35000, labor_rate: 3500 },

  // ── Electrical ────────────────────────────────────────────
  { id: 'battery-replace',     category: 'Electrical',        name: 'Battery Replacement',                 estimated_hours: 0.5, base_cost:  2500, labor_rate: 3500 },
  { id: 'alternator',          category: 'Electrical',        name: 'Alternator Replacement',              estimated_hours: 2.5, base_cost: 16000, labor_rate: 3500 },
  { id: 'starter',             category: 'Electrical',        name: 'Starter Motor Replacement',           estimated_hours: 2.0, base_cost: 13000, labor_rate: 3500 },
  { id: 'elec-diag',           category: 'Electrical',        name: 'Electrical System Diagnostics',       estimated_hours: 1.5, base_cost:  5000, labor_rate: 3500 },
  { id: 'wiring',              category: 'Electrical',        name: 'Wiring / Harness Repair',             estimated_hours: 2.5, base_cost: 10000, labor_rate: 3500 },
  { id: 'sensor',              category: 'Electrical',        name: 'Sensor Replacement (O2/MAF/etc)',     estimated_hours: 1.0, base_cost:  7000, labor_rate: 3500 },

  // ── AC System ─────────────────────────────────────────────
  { id: 'ac-recharge',         category: 'AC System',         name: 'AC Refrigerant Recharge',             estimated_hours: 1.0, base_cost:  8500, labor_rate: 3500 },
  { id: 'ac-service',          category: 'AC System',         name: 'Full AC Service',                     estimated_hours: 2.0, base_cost: 16000, labor_rate: 3500 },
  { id: 'ac-compressor',       category: 'AC System',         name: 'AC Compressor Replacement',           estimated_hours: 4.0, base_cost: 38000, labor_rate: 3500 },
  { id: 'ac-leak',             category: 'AC System',         name: 'AC Leak Detection & Repair',          estimated_hours: 2.0, base_cost: 12000, labor_rate: 3500 },

  // ── Exhaust ───────────────────────────────────────────────
  { id: 'muffler',             category: 'Exhaust',           name: 'Muffler Replacement',                 estimated_hours: 2.0, base_cost: 11000, labor_rate: 3500 },
  { id: 'exhaust-pipe',        category: 'Exhaust',           name: 'Exhaust Pipe Repair / Welding',       estimated_hours: 1.5, base_cost:  6500, labor_rate: 3500 },
  { id: 'cat-converter',       category: 'Exhaust',           name: 'Catalytic Converter Replacement',     estimated_hours: 2.5, base_cost: 30000, labor_rate: 3500 },

  // ── Inspection ────────────────────────────────────────────
  { id: 'pre-purchase',        category: 'Inspection',        name: 'Pre-Purchase Vehicle Inspection',     estimated_hours: 2.0, base_cost:  8000, labor_rate: 3500 },
  { id: 'roadworthy',          category: 'Inspection',        name: 'Roadworthy / Fitness Inspection',     estimated_hours: 1.0, base_cost:  4500, labor_rate: 3500 },
  { id: 'general-inspect',     category: 'Inspection',        name: 'General Vehicle Inspection',          estimated_hours: 1.5, base_cost:  5000, labor_rate: 3500 },
];

export const PRESET_CATEGORIES = [...new Set(SERVICE_PRESETS.map(p => p.category))];

export function getPresetById(id: string): ServicePreset | undefined {
  return SERVICE_PRESETS.find(p => p.id === id);
}

export function formatCost(amount: number): string {
  return `$${amount.toLocaleString('en-JM')}`;
}
