import React from 'react';

const TrendlineCoordinates = ({ trendlines }) => {
  if (!trendlines || trendlines.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No trendlines drawn yet. Click two points on the chart to draw a trendline.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {trendlines.map((trendline) => (
        <div key={trendline.id} className="p-4 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-medium">Trendline #{trendline.id}</h3>
            <span className="text-xs text-gray-400">
              {((trendline.end.y - trendline.start.y) / trendline.start.y * 100).toFixed(2)}% change
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Start Point</p>
              <p className="text-sm text-white">
                Price: ${parseFloat(trendline.start.y).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(trendline.start.x).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">End Point</p>
              <p className="text-sm text-white">
                Price: ${parseFloat(trendline.end.y).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(trendline.end.x).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendlineCoordinates; 