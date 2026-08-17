def generate_executive_report(location_name: str, health_score: float, components: dict):
    # Determine urban status based on overall health score
    status_assessment = "Stable and Controlled" if health_score > 70 else "Under High Environmental Stress"
    
    report_text = f"""
    EXECUTIVE URBAN INTELLIGENCE REPORT FOR: {location_name.upper()}
    ================================================================
    Overall Ecosystem Health Score: {health_score}/100 ({status_assessment})
    
    1. URBAN EXPANSION PRESSURE ({components.get('urban_expansion_pressure')}%):
       Rapid built-up conversion observed over the monitoring window. 
       Unchecked concrete sprawl risks fragmenting local drainage patterns.
       
    2. VEGETATION & ECOLOGICAL HEALTH ({components.get('vegetation_health')}%):
       Canopy cover shows degradation trends near urban fringes. 
       Immediate afforestation zones are recommended in peri-urban sectors.
       
    3. WATER RESOURCES & WETLAND INTEGRITY ({components.get('water_health')}%):
       Surface water retention bodies face encroachment risks. 
       Protection corridors must be legally enforced to prevent waterlogging.
       
    STRATEGIC RECOMMENDATION FOR PLANNERS:
    Implement smart zoning laws emphasizing vertical growth over horizontal sprawl, 
    mandate rooftop greening policies, and prioritize the ecological restoration 
    of Zone B drainage sectors.
    """
    return report_text.strip()