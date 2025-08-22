const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Dijkstra algorithm implementation
function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();
  
  // Initialize distances
  for (const node in graph) {
    distances[node] = node === start ? 0 : Infinity;
    unvisited.add(node);
  }
  
  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let current = null;
    for (const node of unvisited) {
      if (!current || distances[node] < distances[current]) {
        current = node;
      }
    }
    
    if (current === end) break;
    
    unvisited.delete(current);
    
    // Update distances to neighbors
    for (const neighbor in graph[current]) {
      const distance = distances[current] + graph[current][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = current;
      }
    }
  }
  
  // Reconstruct path
  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }
  
  return { path, distance: distances[end] };
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get optimized collection route
router.get('/optimize', async (req, res) => {
  try {
    const { startLat, startLon, priority = 'heavy', levels = 'medium,heavy' } = req.query;
    const wasteLevels = levels.split(',').map(l => l.trim());
    
    // Get containers that need collection based on filter
    const placeholders = wasteLevels.map((_, i) => `$${i + 1}`).join(',');
    const containers = await pool.query(`
      SELECT id, latitude, longitude, waste_level, address
      FROM containers 
      WHERE waste_level IN (${placeholders})
        AND latitude IS NOT NULL 
        AND longitude IS NOT NULL
      ORDER BY 
        CASE waste_level 
          WHEN 'heavy' THEN 1 
          WHEN 'medium' THEN 2 
          ELSE 3 
        END
    `, wasteLevels);
    
    if (containers.rows.length === 0) {
      return res.json({ route: [], totalDistance: 0, message: 'No containers need collection' });
    }
    
    // Build distance graph
    const nodes = ['start', ...containers.rows.map(c => c.id)];
    const graph = {};
    
    // Add start position
    const start = { latitude: parseFloat(startLat), longitude: parseFloat(startLon) };
    
    for (const node of nodes) {
      graph[node] = {};
    }
    
    // Calculate distances between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        
        let pos1, pos2;
        
        if (node1 === 'start') {
          pos1 = start;
        } else {
          const container1 = containers.rows.find(c => c.id === node1);
          pos1 = { latitude: container1.latitude, longitude: container1.longitude };
        }
        
        if (node2 === 'start') {
          pos2 = start;
        } else {
          const container2 = containers.rows.find(c => c.id === node2);
          pos2 = { latitude: container2.latitude, longitude: container2.longitude };
        }
        
        const distance = calculateDistance(pos1.latitude, pos1.longitude, pos2.latitude, pos2.longitude);
        graph[node1][node2] = distance;
        graph[node2][node1] = distance;
      }
    }
    
    // Simple greedy approach for TSP approximation
    const visited = new Set(['start']);
    const route = ['start'];
    let current = 'start';
    let totalDistance = 0;
    
    while (visited.size < nodes.length) {
      let nearest = null;
      let nearestDistance = Infinity;
      
      for (const node of nodes) {
        if (!visited.has(node) && graph[current][node] < nearestDistance) {
          nearest = node;
          nearestDistance = graph[current][node];
        }
      }
      
      if (nearest) {
        route.push(nearest);
        visited.add(nearest);
        totalDistance += nearestDistance;
        current = nearest;
      }
    }
    
    // Add container details to route
    const routeWithDetails = route.map(nodeId => {
      if (nodeId === 'start') {
        return { id: 'start', latitude: start.latitude, longitude: start.longitude, type: 'depot' };
      }
      const container = containers.rows.find(c => c.id === nodeId);
      return {
        id: container.id,
        latitude: container.latitude,
        longitude: container.longitude,
        wasteLevel: container.waste_level,
        address: container.address,
        type: 'container'
      };
    });
    
    res.json({
      route: routeWithDetails,
      totalDistance: Math.round(totalDistance * 100) / 100,
      estimatedTime: Math.round(totalDistance * 2), // Assuming 30 km/h average speed
      containersToCollect: containers.rows.length
    });
    
  } catch (err) {
    console.error('Route optimization error:', err);
    res.status(500).json({ error: 'Failed to optimize route' });
  }
});

module.exports = router;