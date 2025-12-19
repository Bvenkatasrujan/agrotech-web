import { useEffect, useState, useRef } from 'react';

const TRAIL_LENGTH = 20;

export default function MouseTrail() {
    const [points, setPoints] = useState([]);
    const requestRef = useRef();

    useEffect(() => {
        const handleMouseMove = (e) => {
            const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
            setPoints(prevPoints => [newPoint, ...prevPoints.slice(0, TRAIL_LENGTH - 1)]);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {points.map((point, index) => {
                const opacity = 1 - index / TRAIL_LENGTH;
                const size = 20 * (1 - index / TRAIL_LENGTH);
                return (
                    <div
                        key={point.id + index}
                        className="absolute bg-green-500 rounded-full blur-[2px]"
                        style={{
                            left: point.x,
                            top: point.y,
                            width: `${size}px`,
                            height: `${size}px`,
                            opacity: opacity,
                            transform: 'translate(-50%, -50%)',
                            transition: 'all 0.05s ease-out'
                        }}
                    />
                );
            })}
        </div>
    );
}
