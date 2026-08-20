import json
import urllib.request
import os

def generate_normalized_map():
    url = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
    output_path = os.path.join("static", "js", "world_map_data.js")
    
    print(f"Fetching GeoJSON from {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching data: {e}")
        return

    svg_path_parts = []
    
    # Target Viewbox: 1000 x 500
    # Source Geo: Lon -180..180 (Width 360), Lat -90..90 (Height 180)
    
    scale_x = 1000 / 360
    scale_y = 500 / 180
    
    print("Processing features...")
    for feature in data['features']:
        geometry = feature['geometry']
        t = geometry['type']
        coords = geometry['coordinates']
        
        polygons = []
        if t == 'Polygon':
            polygons = [coords] # Polygon is list of rings
        elif t == 'MultiPolygon':
            polygons = coords   # MultiPolygon is list of Polygons (list of list of rings)
            
        for poly in polygons:
            # Each poly is a list of rings (first is exterior, others holes)
            for ring in poly:
                if not ring: continue
                
                path_str = ""
                first = True
                for point in ring:
                    lon, lat = point[0], point[1]
                    
                    # Normalize
                    # x: shift lon by +180 to get 0..360, then scale
                    x = (lon + 180) * scale_x
                    
                    # y: shift lat from 90..-90 to 0..180 (Canvas Y goes down)
                    # 90 degrees (North) should be Y=0
                    # -90 degrees (South) should be Y=500
                    y = (90 - lat) * scale_y
                    
                    # Round to 1 decimal for compactness
                    x = round(x, 1)
                    y = round(y, 1)
                    
                    if first:
                        path_str += f"M{x} {y}"
                        first = False
                    else:
                        path_str += f"L{x} {y}"
                
                path_str += "z" # Close path
                svg_path_parts.append(path_str)

    # Join all parts
    full_svg_path = " ".join(svg_path_parts)

    # Wrap in JS - assign to window to ensure global accessibility
    js_content = f"window.WORLD_MAP_PATH = \"{full_svg_path}\"; console.log('World Map JS file loaded, length: {len(full_svg_path)}');"
    
    with open(output_path, "w") as f:
        f.write(js_content)
        
    print(f"Successfully created {output_path}")
    print(f"Path length: {len(full_svg_path)} chars")

if __name__ == "__main__":
    generate_normalized_map()
