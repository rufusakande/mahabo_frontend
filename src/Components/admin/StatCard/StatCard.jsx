import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ title, value, icon: Icon, color, trend, delay = 0, statsVisible }) => {
  const trendClass = trend > 0 ? 'positive' : 'negative';
  
  return (
    <div
      className={`stat-card ${statsVisible ? 'visible' : ''}`}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="stat-card-header">
        <div 
          className="stat-card-icon"
          style={{
            background: `${color}15`,
            color: color
          }}
        >
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`stat-card-trend ${trendClass}`}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <h3 className="stat-card-value">{value.toLocaleString()}</h3>
        <p className="stat-card-title">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;