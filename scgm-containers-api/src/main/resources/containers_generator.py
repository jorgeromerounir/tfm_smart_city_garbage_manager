import uuid
import random
import json
from datetime import datetime, timedelta

def get_waste_level_status_from_value(value):
    if value <= 33.0:
        return 'LIGHT'
    elif value <= 66.0:
        return 'MEDIUM'
    else:
        return 'HEAVY'

def generate_sql_insert_script(num_records=10500, filename='containers_data.sql', json_filename='containers_id_list.json'):
    """
    Generates a SQL script with a specified number of INSERT statements for the
    'containers' table and saves it to a file.
    Args:
        num_records (int): The number of records to generate.
        filename (str): The name of the output SQL file.
        json_filename (str): The name of the output JSON file for container IDs.
    """
    # Range of coordinates for Bogotá, Colombia
    min_lat, max_lat = 4.4988, 4.7955
    min_lon, max_lon = -74.2057, -74.0200

    # Example addresses in Bogotá
    addresses = [
        "Carrera test 7 # 45-32", "Avenida test 19 # 120-50", "Calle test 85 # 11-23", 
        "Carrera test 15 # 32-45", "Avenida test 68 # 45-23", "Calle test 100 # 15-32",
        "Carrera test 11 # 85-12", "Avenida test 26 # 52-34", "Calle test 72 # 10-45",
        "Carrera test 5 # 23-67", "Avenida test 39 # 15-28", "Calle test 45 # 22-10"
    ]

    # Date range for August 2025
    start_date = datetime(2025, 8, 1, 0, 0, 0)
    end_date = datetime(2025, 8, 31, 23, 59, 59)
    time_delta = end_date - start_date
    total_seconds = int(time_delta.total_seconds())

    print(f"Generating {num_records} SQL INSERT statements...")
    
    container_ids = []

    with open(filename, 'w') as f:
        # Write the initial part of the INSERT statement
        f.write("INSERT INTO containers (id, latitude, longitude, waste_level_value, waste_level_status, temperature, address, city_id, customer_id, created_at, updated_at) VALUES\n")

        for i in range(num_records):
            # Generate a unique ID using UUID
            container_id = str(uuid.uuid4())
            container_ids.append(container_id)
            
            # Generate random coordinates within Bogotá
            latitude = round(random.uniform(min_lat, max_lat), 8)
            longitude = round(random.uniform(min_lon, max_lon), 8)
            
            # Generate random waste level (0-100) and temperature (20-30)
            waste_level_value = round(random.uniform(0, 100), 4)
            temperature = round(random.uniform(20, 30), 2)
            
            # Determine the waste level status based on the value
            waste_level_status = get_waste_level_status_from_value(waste_level_value)
            
            # Select a random address
            address = random.choice(addresses)
            
            # Generate a random timestamp within August 2025
            random_seconds = random.randint(0, total_seconds)
            random_date = start_date + timedelta(seconds=random_seconds)
            formatted_date = random_date.strftime('%Y-%m-%d %H:%M:%S')
            
            # Format the values for the INSERT statement
            values = f"('{container_id}', {latitude}, {longitude}, {waste_level_value}, '{waste_level_status}', {temperature}, '{address}', 1, 1, '{formatted_date}', '{formatted_date}')"
            
            # Add comma or semicolon
            if i < num_records - 1:
                values += ","
            else:
                values += ";"
            
            # Write the formatted string to the file
            f.write(values + "\n")

    print(f"Successfully generated SQL script and saved to '{filename}'.")
    
    # Generate JSON file with container IDs
    with open(json_filename, 'w') as json_file:
        json.dump({"container_ids": container_ids}, json_file, indent=2)
    
    print(f"Successfully generated container IDs JSON and saved to '{json_filename}'.")

if __name__ == '__main__':
    generate_sql_insert_script()
