export default class Graph {
  constructor() {
    this.nodes = {};
    this.polylines = [];
  }

  addNode(lat, lng) {
    const nodeId = this.getNodeId(lat, lng);
    if (!this.nodes[nodeId]) {
      this.nodes[nodeId] = {
        id: nodeId,
        lat,
        lng,
        neighbors: {},
        visitCount: 0,
      };
    }
  }

  addEdge(nodeId1, nodeId2) {
    const node1 = this.nodes[nodeId1];
    const node2 = this.nodes[nodeId2];

    if (node1 && node2) {
      const distance = this.calculateDistance(node1, node2);
      node1.neighbors[nodeId2] = distance;
      node2.neighbors[nodeId1] = distance;
    }
  }

  getVisitCount(lat, lng) {
    const nodeId = this.getNodeId(lat, lng);
    const node = this.nodes[nodeId];

    return node ? node.visitCount : 0;
  }

  getShortestPath(startNodeId, targetNodeId) {
    console.log(startNodeId, targetNodeId);
    const distances = {};
    const heuristicDistances = {};
    const totalDistances = {};
    const visited = {};
    const previousNodes = {};

    Object.keys(this.nodes).forEach((nodeId) => {
      distances[nodeId] = Infinity;
      heuristicDistances[nodeId] = Infinity;
      previousNodes[nodeId] = null;
    });

    distances[startNodeId] = 0;
    heuristicDistances[startNodeId] = this.heuristic(
      this.nodes[startNodeId],
      this.nodes[targetNodeId]
    );
    totalDistances[startNodeId] = heuristicDistances[startNodeId];

    while (true) {
      const currentNodeId = this.getMinTotalDistanceNode(
        totalDistances,
        visited
      );

      if (!currentNodeId) {
        break;
      }

      visited[currentNodeId] = true;

      if (currentNodeId === targetNodeId) {
        return this.reconstructPath(previousNodes, startNodeId, targetNodeId);
      }

      const neighbors = this.nodes[currentNodeId].neighbors;

      for (const neighborNodeId in neighbors) {
        const distance = distances[currentNodeId] + neighbors[neighborNodeId];

        if (distance < distances[neighborNodeId]) {
          distances[neighborNodeId] = distance;
          heuristicDistances[neighborNodeId] = this.heuristic(
            this.nodes[neighborNodeId],
            this.nodes[targetNodeId]
          );
          totalDistances[neighborNodeId] =
            distances[neighborNodeId] + heuristicDistances[neighborNodeId];
          previousNodes[neighborNodeId] = currentNodeId;
        }
      }
    }

    return [];
  }

  getMinTotalDistanceNode(totalDistances, visited) {
    let minTotalDistance = Infinity;
    let minTotalDistanceNode = null;

    for (const nodeId in totalDistances) {
      const totalDistance = totalDistances[nodeId];

      if (totalDistance < minTotalDistance && !visited[nodeId]) {
        minTotalDistance = totalDistance;
        minTotalDistanceNode = nodeId;
      }
    }

    return minTotalDistanceNode;
  }

  reconstructPath(previousNodes, startNodeId, targetNodeId) {
    const path = [];
    let currentNodeId = targetNodeId;

    while (currentNodeId !== startNodeId) {
      path.unshift(currentNodeId);
      currentNodeId = previousNodes[currentNodeId];
    }

    path.unshift(startNodeId);

    return path;
  }

  getNodeId(lat, lng) {
    return `${lat}${lng}`;
  }

  heuristic(node1, node2) {
    return Math.sqrt(
      (node1.lat - node2.lat) ** 2 + (node1.lng - node2.lng) ** 2
    );
  }

  calculateDistance(node1, node2) {
    return Math.sqrt(
      (node1.lat - node2.lat) ** 2 + (node1.lng - node2.lng) ** 2
    );
  }
}
