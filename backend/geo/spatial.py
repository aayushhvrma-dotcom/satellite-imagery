from shapely.geometry import box
import geopandas as gpd

def get_aoi_polygon(lat: float, lon: float, radius_km: float):
    # 1 degree of latitude is roughly 111 kilometers
    deg_offset = radius_km / 111.0
    
    minx = lon - deg_offset
    miny = lat - deg_offset
    maxx = lon + deg_offset
    maxy = lat + deg_offset
    
    # Create the bounding box geometry
    geom = box(minx, miny, maxx, maxy)
    return geom

def calculate_area_km2(geom) -> float:
    # Convert the geometry into a GeoDataFrame to calculate exact area
    gdf = gpd.GeoDataFrame(index=[0], geometry=[geom], crs="EPSG:4326")
    
    # Reproject to a metric system (Web Mercator) for accurate square meters
    gdf_proj = gdf.to_crs(epsg=3857)
    area_sq_meters = gdf_proj.geometry.area.iloc[0]
    
    return float(area_sq_meters / 1_000_000)