import { useEffect } from 'react';

const useAnimatedSVG = (): void => {
  useEffect(() => {
    const gElements = document.querySelectorAll('g[transform^="matrix(1,0,0,1,"]');
    const animatedItems: { el: Element; cx: number; cy: number; phase?: number }[] = [];
    let sumX = 0, sumY = 0, count = 0;

    gElements.forEach(g => {
      const transformStr = g.getAttribute("transform");
      const match = transformStr?.match(/matrix\(1,0,0,1,([-\d.]+),([-\d.]+)\)/);
      if (match) {
        const cx = parseFloat(match[1]);
        const cy = parseFloat(match[2]);
        animatedItems.push({ el: g, cx, cy });
        sumX += cx;
        sumY += cy;
        count++;
      }
    });

    if (count === 0) return;

    const globalCx: number = sumX / count;
    const globalCy: number = sumY / count;
    const rx: number = 20;
    const ry: number = 10;
    const period: number = 4;

    animatedItems.forEach(item => {
      item.phase = Math.atan2(item.cy - globalCy, item.cx - globalCx);
    });

    const startTime: number = performance.now();

    function animate() {
      const now: number = performance.now();
      const t: number = (now - startTime) / 1000;
      const theta: number = (t % period) / period * 2 * Math.PI;

      animatedItems.forEach(item => {
        const offsetX: number = rx * (Math.cos(theta + item.phase!) - Math.cos(item.phase!));
        const offsetY: number = ry * (Math.sin(theta + item.phase!) - Math.sin(item.phase!));
        const newX: number = item.cx + offsetX;
        const newY: number = item.cy + offsetY;
        item.el.setAttribute("transform", `matrix(1,0,0,1,${newX},${newY})`);
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);
};

export default useAnimatedSVG;
