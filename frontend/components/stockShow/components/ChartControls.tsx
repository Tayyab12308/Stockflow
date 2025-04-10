import React, { useState, memo } from 'react';
import { Period } from '../../../util/util';
import { IndicatorKeys, TECHNICAL_INDICATORS } from '../../../constants/technical_indicators';

interface ChartControlsProps {
  ranges: Period[];
  selectedRange: Period;
  onRangeChange: (range: Period) => void;
  chartType: 'baseline' | 'candlestick';
  onChartTypeChange: (type: 'baseline' | 'candlestick') => void;
  loadingRanges: Set<Period>;
  activeIndicators: Set<IndicatorKeys>;
  onToggleIndicator: (indicator: IndicatorKeys) => void;
  loadingIndicators: Set<IndicatorKeys>;
}

const ChartControls: React.FC<ChartControlsProps> = memo(({
  ranges,
  selectedRange,
  onRangeChange,
  chartType,
  onChartTypeChange,
  loadingRanges,
  activeIndicators,
  onToggleIndicator,
  loadingIndicators
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggleChartType = () => {
    onChartTypeChange(chartType === 'baseline' ? 'candlestick' : 'baseline');
  };

  return (
    <>
      <div className="controls-container">
        {/* Range selection buttons */}
        <div className="range-buttons">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              disabled={loadingRanges.has(range)}
              className={`range-button ${selectedRange === range ? 'active' : ''} ${loadingRanges.has(range) ? 'loading' : ''}`}
            >
              {range}
              {loadingRanges.has(range) && " ..."}
            </button>
          ))}
        </div>

        <div className="controls-right">
          {/* Technical Indicators Dropdown - only enabled for candlestick charts */}
          {chartType === 'candlestick' && (
            <div className="indicator-dropdown">
              <button
                onClick={() => chartType === 'candlestick' && setDropdownOpen(!dropdownOpen)}
                className={`chart-button ${chartType !== 'candlestick' ? 'disabled' : ''}`}
              >
                Add Indicator {dropdownOpen ? '▲' : '▼'}
              </button>

              {dropdownOpen && chartType === 'candlestick' && (
                <div className="dropdown-menu">
                  {Object.keys(TECHNICAL_INDICATORS).map((key) => {
                    const indicator = key as IndicatorKeys;
                    const config = TECHNICAL_INDICATORS[indicator];
                    const isActive = activeIndicators.has(indicator);
                    const isLoading = loadingIndicators.has(indicator);

                    return (
                      <div
                        key={indicator}
                        onClick={() => {
                          if (!isLoading) {
                            onToggleIndicator(indicator);
                            setDropdownOpen(false);
                          }
                        }}
                        className={`dropdown-item ${isLoading ? 'loading' : ''}`}
                        style={{ color: config.color }}
                      >
                        <span>{config.name}</span>
                        {isActive ? (
                          <span>✓</span>
                        ) : isLoading ? (
                          <span>...</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Chart type toggle button */}
          <button
            onClick={toggleChartType}
            className="chart-button"
          >
            {chartType === 'baseline' ? 'Switch to Candlestick' : 'Switch to Line'}
          </button>
        </div>
      </div>

      {/* Active indicators list with remove buttons - only visible in candlestick mode */}
      {activeIndicators.size > 0 && chartType === 'candlestick' && (
        <div className="active-indicators">
          {Array.from(activeIndicators).map(indicator => (
            <div
              key={indicator}
              className="indicator-tag"
              style={{ borderColor: TECHNICAL_INDICATORS[indicator].color }}
            >
              <span style={{ color: TECHNICAL_INDICATORS[indicator].color }}>
                {TECHNICAL_INDICATORS[indicator].name}
              </span>
              <button
                onClick={() => onToggleIndicator(indicator)}
                className="remove-indicator"
              >
                ✕
              </button>
              {loadingIndicators.has(indicator) && (
                <span className="loading-indicator">loading...</span>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
});

export default ChartControls;