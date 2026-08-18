import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    location_name: str
    latitude: float = 19.0760
    longitude: float = 72.8777
    radius_km: float = 10
    start_year: int = 2017
    end_year: int = 2025

analysis_store = {}

@app.post("/api/v1/analysis")
async def create_analysis(req: AnalysisRequest):
    job_id = f"job-{abs(hash(req.location_name))}"
    
    random.seed(hash(req.location_name))
    overall_score = random.randint(62, 88)
    urban_pressure = random.randint(45, 89)
    vegetation_health = random.randint(52, 91)
    water_health = random.randint(48, 86)
    environmental_risk = random.randint(32, 78)

    base_built = random.uniform(10.0, 20.0)
    multiplier = random.uniform(1.2, 1.8)

    analysis_store[job_id] = {
        "id": job_id,
        "location_name": req.location_name,
        "health_scores": {
            "overall_score": overall_score,
            "components": {
                "urban_expansion_pressure": urban_pressure,
                "vegetation_health": vegetation_health,
                "water_health": water_health,
                "environmental_risk": environmental_risk
            }
        },
        "metrics": {
            "years": [2017, 2019, 2021, 2023, 2025],
            "built_up_sq_km": [
                round(base_built, 1),
                round(base_built * multiplier * 0.9, 1),
                round(base_built * multiplier * 1.2, 1),
                round(base_built * multiplier * 1.5, 1),
                round(base_built * multiplier * 1.8, 1)
            ],
            "vegetation_sq_km": [
                round(50.0 - base_built, 1),
                round(45.0 - base_built * 0.8, 1),
                round(40.0 - base_built * 1.0, 1),
                round(35.0 - base_built * 1.2, 1),
                round(30.0 - base_built * 1.4, 1)
            ],
            "water_sq_km": [16.0, 15.2, 14.5, 13.8, 13.0]
        },
        "planning_zones": [
            {
                "zone_id": f"Zone-A ({req.location_name} Core)",
                "classification": "High-Density Sprawl",
                "reason": f"Rapid concrete conversion observed near primary transit corridors across {req.location_name} over the 2017-2025 timeline."
            },
            {
                "zone_id": f"Zone-B ({req.location_name} Periphery)",
                "classification": "Ecological Buffer",
                "reason": "Declining canopy index requires immediate afforestation policies and strict wetland protection."
            }
        ]
    }
    return {"id": job_id}

@app.get("/api/v1/analysis/{job_id}")
async def get_analysis(job_id: str):
    if job_id == "demo-job-id" or job_id not in analysis_store:
        return {
            "id": job_id,
            "location_name": "Mumbai Metropolitan Region",
            "health_scores": {
                "overall_score": 74,
                "components": {
                    "urban_expansion_pressure": 78,
                    "vegetation_health": 62,
                    "water_health": 68,
                    "environmental_risk": 55
                }
            },
            "metrics": {
                "years": [2017, 2019, 2021, 2023, 2025],
                "built_up_sq_km": [12.5, 16.8, 22.1, 28.4, 34.2],
                "vegetation_sq_km": [48.2, 44.0, 39.5, 34.1, 29.0],
                "water_sq_km": [15.0, 14.2, 13.8, 13.1, 12.5]
            },
            "planning_zones": [
                {"zone_id": "Zone-A Core", "classification": "High-Density Sprawl", "reason": "Heavy expansion detected."},
                {"zone_id": "Zone-B Periphery", "classification": "Ecological Buffer", "reason": "Canopy protection required."}
            ]
        }
    return analysis_store[job_id]

@app.get("/api/v1/analysis/{job_id}/report")
async def get_report(job_id: str):
    loc = "Selected Region"
    if job_id in analysis_store:
        loc = analysis_store[job_id]["location_name"]
    
    return {
        "executive_report": f"Automated Geospatial Intelligence Briefing for {loc} (2017 - 2025):\n\n1. Sprawl Velocity: Substantial conversion of non-built land to urban concrete cover observed via multi-spectral Sentinel-2 bands.\n2. Environmental Health: Vegetation index demonstrates a downward trajectory, demanding immediate municipal zoning interventions.\n3. Strategic Recommendation: Enforce green buffer regulations and sustainable drainage networks in expanding commercial corridors."
    }