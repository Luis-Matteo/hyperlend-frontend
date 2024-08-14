import React from 'react';

interface GaugeProps {
    value: number; // The value to display in the center
    maxValue: number; // The maximum value of the gauge
    size?: number; // Diameter of the gauge
    strokeWidth?: number; // Width of the stroke for the arcs
}

const Gauge: React.FC<GaugeProps> = ({ value, maxValue, size = 200, strokeWidth = 10 }) => {
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const normalizedValue = Math.min(Math.max(value, 0), maxValue) / maxValue;
    const arcLength = circumference * normalizedValue;

    const renderTicks = () => {
        const ticks = [];
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * 180 - 90; // Spread ticks across 180 degrees
            const tickX = center + radius * Math.cos((angle * Math.PI) / 180);
            const tickY = center + radius * Math.sin((angle * Math.PI) / 180);
            ticks.push(<circle key={i} cx={tickX} cy={tickY} r={2} fill={i < 30 ? '#FF6666' : '#6E6E6E'} />);
        }
        return ticks;
    };

    return (
        <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size -100}`}>
            <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#333"
                strokeWidth={strokeWidth}
                fill="none"
                opacity="0.2"
            />
            <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#FF6666"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={arcLength + ' ' + (circumference - arcLength)}
                strokeDashoffset={circumference / 4} // Start the arc from the left
                strokeLinecap="round"
                transform={`rotate(-90, ${center}, ${center})`}
            />
            {renderTicks()}
            <text x={center} y={center} textAnchor="middle" fontSize="32" fill="#FFF">
                {value.toFixed(1)}
            </text>
        </svg>
    );
};

export default Gauge;
