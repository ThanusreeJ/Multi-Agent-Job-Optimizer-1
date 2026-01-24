import random
from datetime import datetime, timedelta
from typing import List
from .schemas import Job, JobPriority, MachineDowntime

# Product types with specific characteristics
PRODUCT_TYPES = ["P_A", "P_B", "P_C"]
MACHINES = ["M1", "M2", "M3", "M4"]

# Machine compatibility matrix (which machines can produce which products)
MACHINE_CAPABILITIES = {
    "M1": ["P_A", "P_B"],
    "M2": ["P_A", "P_C"],
    "M3": ["P_B", "P_C"],
    "M4": ["P_A", "P_B", "P_C"]
}

def generate_random_jobs(count: int = 20, rush_probability: float = 0.2) -> List[Job]:
    """
    Generate jobs in format: job_id, product, duration, deadline, priority, compatible_machines
    """
    jobs = []
    base_time = datetime.now().replace(hour=8, minute=0, second=0, microsecond=0)
    
    for i in range(count):
        # Job ID
        job_id = f"J{i+1:03d}"
        
        # Product type (P_A, P_B, P_C)
        product = random.choice(PRODUCT_TYPES)
        
        # Duration (processing time) based on product type
        if product == "P_A":
            duration = random.choice([30, 45, 60])  # Shorter jobs
        elif product == "P_B":
            duration = random.choice([45, 60, 90])  # Medium jobs
        else:  # P_C
            duration = random.choice([60, 90, 120])  # Longer jobs
        
        # Priority (rush or normal)
        is_rush = random.random() < rush_probability
        priority = JobPriority.RUSH if is_rush else JobPriority.NORMAL
        
        # Deadline - rush jobs get tighter deadlines
        if is_rush:
            # Rush: 2-4 hours from shift start
            due_offset = random.randint(120, 240)
        else:
            # Normal: 4-7 hours from shift start
            due_offset = random.randint(240, 420)
        deadline = (base_time + timedelta(minutes=due_offset)).strftime("%H:%M")
        
        # Compatible machines - based on product type and machine capabilities
        compatible_machines = [m_id for m_id, caps in MACHINE_CAPABILITIES.items() if product in caps]
        
        # Sometimes restrict to subset for complexity
        if len(compatible_machines) > 2 and random.random() < 0.3:
            compatible_machines = random.sample(compatible_machines, random.randint(1, 2))
        
        job = Job(
            job_id=job_id,
            product_type=product,
            machine_options=compatible_machines,
            processing_time=duration,
            due_time=deadline,
            priority=priority
        )
        jobs.append(job)
    
    # Sort to make output more organized (for display)
    jobs.sort(key=lambda x: (0 if x.priority == JobPriority.RUSH else 1, x.due_time, x.job_id))
    
    return jobs

def generate_random_downtime(count: int = 1) -> List[MachineDowntime]:
    downtimes = []
    # Generate requested number of downtime events
    for _ in range(count):
        machine = random.choice(MACHINES)
        # Random start between 9 AM and 2 PM
        start_hour = random.randint(9, 14)
        start_min = random.choice([0, 15, 30, 45])
        duration = random.randint(30, 90)
        
        start_dt = datetime.now().replace(hour=start_hour, minute=start_min, second=0)
        end_dt = start_dt + timedelta(minutes=duration)
        
        downtimes.append(MachineDowntime(
            machine_id=machine,
            start_time=start_dt.strftime("%H:%M"),
            end_time=end_dt.strftime("%H:%M"),
            reason=random.choice(["Maintenance", "Tool Breakage", "Calibration"])
        ))
    return downtimes
