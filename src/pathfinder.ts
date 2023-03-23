interface Point {
   x: number;
   y: number;
}
type ProgressFn = (p: number) => void;

interface Result {
   points: Point[];
   distance: number;
}

const pathfinder = (points: Point[], progressFn: ProgressFn): Result | 'Too few points' => {
   const distanceBetweenPoints = (point1: Point, point2: Point): number =>
      Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);

   const calculateDistanceInPath = (path: number[]) => {
      let distance: number = 0;
      let newArray = [0, ...path];

      for (let i = 0; i < newArray.length - 1; i++) {
         distance = distance + distanceBetweenPoints(points[newArray[i]], points[newArray[i + 1]]);
      }
      return Math.round(distance);
   };

   const getAmountOfPossibilities = (pointsLength: number) => {
      let result = 1;
      for (let i = 1; i < pointsLength; i++) {
         result *= i;
      }
      return result;
   };

   if (points.length < 3) {
      return 'Too few points';
   }

   const pointsLength = points.length;
   let possibilities = getAmountOfPossibilities(pointsLength);

   let numArr = [];

   for (let i = 0; i < pointsLength; i++) {
      numArr[i] = i;
   }

   numArr = numArr.reverse();
   numArr[0]--;

   let shortestDistance = Infinity;
   let shortestPath: number[] = [];
   let amountOfCheckedPossibilities = 0;

   while (numArr[numArr.length - 1] != 1) {
      numArr[0] = numArr[0] + 1;

      while (true) {
         const index = numArr.indexOf(pointsLength);
         if (index == -1) break;
         numArr[index + 1] = numArr[index + 1] + 1;
         numArr[index] = 0;
      }

      if (numArr.length == new Set(numArr).size) {
         amountOfCheckedPossibilities++;
         progressFn(Math.floor((amountOfCheckedPossibilities * 100) / possibilities));
         const distance = calculateDistanceInPath(numArr);
         if (shortestDistance > distance) {
            shortestDistance = distance;
            shortestPath = [0, ...numArr];
         }
      }
   }

   return {
      points: shortestPath.map((num) => points[num]),
      distance: shortestDistance,
   };
};

onmessage = (e) => {
   postMessage([
      'result',
      pathfinder(e.data, (p: number) => {
         postMessage(['time', p + '%']);
      }),
   ]);
};
