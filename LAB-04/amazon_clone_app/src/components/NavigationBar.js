import React from 'react';
import './NavigationBar.css';

function NavigationBar() {
  return (
    <div className="navigation-bar">
      <div className="nav-left">
        <div className="nav-item menu-item">
          <span className="menu-icon">☰</span> All
        </div>
        <div className="nav-item">Today's Deals</div>
        <div className="nav-item">Customer Service</div>
        <div className="nav-item">Registry</div>
        <div className="nav-item">Gift Cards</div>
        <div className="nav-item">Sell</div>
      </div>
      <div className="nav-right">
        <div className="nav-item bold-item">Amazon's response to COVID-19</div>
      </div>
    </div>
  );
}

export default NavigationBar;
