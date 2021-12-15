import pathfinder from './pathfinder';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d');

const startBtn = document.querySelector('.startBtn') as HTMLButtonElement;
const restartBtn = document.querySelector('.restartBtn') as HTMLButtonElement;
const timeDisplay = document.querySelector('.timeDisplay') as HTMLSpanElement;
const pointsDisplay = document.querySelector('.pointsDisplay') as HTMLSpanElement;

const distanceDisplay = document.querySelector('.distanceDisplay') as HTMLSpanElement;

interface Point {
   x: number;
   y: number;
}

let pointsArr: Point[] = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.onclick = (e) => addPoint({ x: e.clientX, y: e.clientY });

restartBtn.onclick = () => {
   clearCanvas();
   restartStats();
};

interface ShortestPath {
   distance: number;
   points: Point[];
}

const formattedTime = (milliseconds: number): string => {
   const seconds = String(Math.round(milliseconds / 1000));
   const minutes = String(Math.round(milliseconds / 60000));

   return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
};

startBtn.onclick = () => {
   startBtn.textContent = 'Searching...';
   const startTime = new Date().getTime();
   const shortestPath: ShortestPath | 'exit' = pathfinder(pointsArr);
   const endTime = new Date().getTime();

   if (shortestPath !== 'exit') {
      insertValToEl(distanceDisplay, String(shortestPath.distance) + 'px');
      paintLines(shortestPath.points);
      const timeDelta = endTime - startTime;
      insertValToEl(timeDisplay, formattedTime(timeDelta));
   } else {
      alert('Too few points');
   }
   startBtn.textContent = 'Find';
};

const restartStats = () => {
   insertValToEl(pointsDisplay, '0');
   insertValToEl(distanceDisplay, '0');
   insertValToEl(timeDisplay, '00:00');
};

const addPoint = ({ x, y }: Point): void => {
   paintPoint(x, y);
   pointsArr.push({ x: x, y: y });
   insertValToEl(pointsDisplay, String(pointsArr.length));
};

const paintPoint = (x: number, y: number): void | 'exit' => {
   if (!ctx) return 'exit';
   let circle = new Path2D();
   circle.moveTo(125, 35);
   circle.arc(x, y, 6, 0, 2 * Math.PI);
   ctx.fill(circle);
};

const clearCanvas = () => {
   if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
   }
   pointsArr = [];
   insertValToEl(pointsDisplay, String(pointsArr.length));
};

const paintLine = (point1: Point, point2: Point): void => {
   if (ctx) {
      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);
      ctx.stroke();
   }
};

const paintLines = (arr: Point[]) => {
   for (let i = 0; i < arr.length - 1; i++) {
      paintLine(arr[i], arr[i + 1]);
   }
};

const insertValToEl = (el: HTMLSpanElement, val: string): void => {
   el.textContent = val;
};
