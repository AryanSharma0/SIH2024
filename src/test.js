/**
 * @param {number[][]} graph
 * @return {number[][]}
 */
var allPathsSourceTarget = function (graph) {
  var res = [];
  for (let i = 0; i < graph[0].length; i++) {
    let j = 0;
    var visited = [];
    !visited[j] && visited.push(0);
    console.log("i", i);
    while (j < graph.length) {
      console.log(j);
      if (graph[j] === []) {
        break;
      }
      console.log("Graph", graph[j][i]);
      visited.push(graph[j][i]);
      j = graph[j][i];
      if (visited[visited.length - 1] === graph.length - 1) {
        console.log(visited);
        console.log("visited");
        res.push(visited);
        break;
      }
      console.log(visited);
    }
  }
  console.log("result", res);
  return graph;
};

allPathsSourceTarget([[1, 2], [3], [3], []]);
