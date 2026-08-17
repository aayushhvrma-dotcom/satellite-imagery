import random

def calculate_city_health(area_sq_km: float):
    # Simulated metrics engine representing U-Net output / pixel analysis
    base_score = 70.0
    
    # Generate realistic historical trajectory metrics (2017 to 2025)
    years = list(range(2017, 2026))
    
    # Scale growth based on the total area
    built_up = [round(area_sq_km * 0.2 + (i * 0.8), 2) for i in range(len(years))]
    vegetation = [round(area_sq_km * 0.5 - (i * 0.5), 2) for i in range(len(years))]
    water = [round(area_sq_km * 0.15 - (i * 0.1), 2) for i in range(len(years))]
    
    # Calculate health components
    veg_health = max(30.0, min(90.0, 75.0 - (len(years) * 1.2)))
    water_health = max(20.0, min(85.0, 65.0 - (len(years) * 0.8)))
    urban_pressure = min(95.0, 40.0 + (len(years) * 3.5))
    env_risk = max(10.0, min(90.0, 100.0 - veg_health))
    
    overall_score = round((veg_health + water_health + (100 - urban_pressure) + (100 - env_risk)) / 4, 1)
    
    return {
        "overall_score": overall_score,
        "components": {
            "vegetation_health": round(veg_health, 1),
            "water_health": round(water_health, 1),
            "urban_expansion_pressure": round(urban_pressure, 1),
            "environmental_risk": round(env_risk, 1)
        },
        "metrics": {
            "years": years,
            "built_up_sq_km": built_up,
            "vegetation_sq_km": vegetation,
            "water_sq_km": water
        },
        "planning_zones": [
            {
                "zone_id": "Zone A",
                "classification": "Development Priority",
                "reason": "Stable ground stability and low ecological density detected by satellite indices."
            },
            {
                "zone_id": "Zone B",
                "classification": "Restoration / Sensitive",
                "reason": "Rapid depletion of surface water and vegetation observed over the 8-year span."
            }
        ]
    }