export interface Point {
   x: number;
   y: number;
}

const isEveryNumUniqInArr = (arr: number[]): boolean => {
   let uniqNumArr = new Set(arr);
   if (uniqNumArr.size === arr.length) return true;
   return false;
};

const distanceBetweenPoints = (point1: Point, point2: Point): number =>
   Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);

const getEveryPathCombination = (pathAmount: number) => {
   let numArr = [];
   for (let i = 0; i < pathAmount; i++) {
      numArr[i] = 0;
   }
   let result = [];
   while (numArr.length < pathAmount + 1) {
      if (isEveryNumUniqInArr(numArr)) {
         result.push([...numArr]);
      }
      numArr[0] += 1;
      for (let i = 0; i < numArr.length; i++) {
         if (numArr[i] === pathAmount) {
            numArr[i] = 0;
            numArr[i + 1] += 1;
         }
      }
   }
   console.log(result.length);
   return result;
};

interface PathAndDistance {
   distance: number;
   path: number[];
}

const findShortestPath = (allPathsAndDistance: PathAndDistance[]) => {
   let shortestPath = allPathsAndDistance[0];

   allPathsAndDistance.forEach((path) => {
      if (path.distance < shortestPath.distance) shortestPath = path;
   });

   return shortestPath;
};

const pathfinder = (points: Point[]): { points: Point[]; distance: number } | 'exit' => {
   if (points.length < 3) {
      return 'exit';
   }
   let pathComb = getEveryPathCombination(points.length);

   let allPathsAndDistance: PathAndDistance[] = [];
   for (let path of pathComb) {
      path[path.length] = path[0];
      let distance: number = 0;
      for (let i = 0; i < path.length - 1; i++) {
         distance = distance + distanceBetweenPoints(points[path[i]], points[path[i + 1]]);
      }

      allPathsAndDistance = [...allPathsAndDistance, { distance: distance, path: path }];
   }

   let shortestPath = findShortestPath(allPathsAndDistance);

   if (shortestPath?.path) {
      return {
         points: shortestPath.path.map((index: number) => {
            return points[index];
         }),
         distance: Math.round(shortestPath.distance * 100) / 100,
      };
   }

   return 'exit';
};

export default pathfinder;
