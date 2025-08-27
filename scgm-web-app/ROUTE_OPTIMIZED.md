**Objective:** Review this project and update the backend by adapting Sweep + Dijkstra.

Because this is no longer just a "shortest path" problem, but a classic Vehicle Routing Problem (VRP) or at least a variant of the Traveling Salesman Problem (TSP):

- You have a depot or starting point (collection station).
- You have several points to visit (garbage containers).
- The objective is to find an optimal route that passes through all points while minimizing the total distance/time.
- You have several trucks, and you need to assign groups of containers to each one.

**Instructions:**
- Adjust the backend (backend folder) to use Sweep + Dijkstra
- You must adjust the frontend (frontend folder) so that the SUPERVISOR can assign the created route to an OPERATOR.
- Add the function so that the SUPERVISOR can assign a truck to the OPERATOR.
- Allow the OPERATOR to export the route to Google Maps and Waze.
