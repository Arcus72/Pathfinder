const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d');

const startBtn = document.querySelector('.startBtn') as HTMLButtonElement;
const restartBtn = document.querySelector('.restartBtn') as HTMLButtonElement;
const timeDisplay = document.querySelector('.timeDisplay') as HTMLSpanElement;
const pointsDisplay = document.querySelector('.pointsDisplay') as HTMLSpanElement;

const distanceDisplay = document.querySelector('.distanceDisplay') as HTMLSpanElement;
const percentDiv = document?.querySelector('.percent');
const loaderDiv = document.querySelector('.loader') as HTMLSpanElement;
const warningCurtain = document.querySelector('.warningCurtain') as HTMLDivElement;

const myWorker = new Worker(new URL('./pathfinder.ts', import.meta.url), { type: 'module' });

interface Point {
   x: number;
   y: number;
}

interface ShortestPath {
   distance: number;
   points: Point[];
}

let isAddingPointEnabled = true;
let pointsArr: Point[] = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.onclick = (e) => isAddingPointEnabled && addPoint({ x: e.clientX, y: e.clientY });

restartBtn.onclick = () => {
   isAddingPointEnabled = true;
   clearCanvas();
   restartStats();
};

const formattedTime = (milliseconds: number): string => {
   const seconds = String(Math.floor((milliseconds / 1000) % 60));
   const minutes = String(Math.floor((milliseconds / (60 * 1000)) % 60));

   return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
};

let startTime: number;
startBtn.onclick = () => {
   loaderDiv.style.display = 'flex';
   startBtn.disabled = true;
   startTime = new Date().getTime();
   myWorker.postMessage(pointsArr);
};

myWorker.onmessage = (e) => {
   if (e.data[0] == 'time') {
      percentDiv!.textContent = e.data[1];
   } else {
      const shortestPath: ShortestPath | 'Too few points' = e.data[1];
      const endTime = new Date().getTime();
      loaderDiv.style.display = 'none';
      if (shortestPath !== 'Too few points') {
         isAddingPointEnabled = false;
         const timeDelta = endTime - startTime;
         distanceDisplay.textContent = String(shortestPath.distance) + 'px';
         paintLines(shortestPath.points);
         timeDisplay.textContent = formattedTime(timeDelta);
      } else {
         warningCurtain.classList.add('show');
         startBtn.disabled = false;
      }
   }
};

warningCurtain.onclick = () => warningCurtain.classList.remove('show');

const restartStats = () => {
   pointsDisplay.textContent = '0';
   distanceDisplay.textContent = '0';
   timeDisplay.textContent = '00:00';
   startBtn.disabled = false;
};

const addPoint = ({ x, y }: Point): void => {
   paintPoint(x, y);
   pointsArr.push({ x: x, y: y });
   pointsDisplay.textContent = String(pointsArr.length);
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
   pointsDisplay.textContent = String(pointsArr.length);
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
