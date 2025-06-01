# Interactive Trading Chart with Trendline Analysis

A powerful, interactive trading chart application built with React and Next.js that allows users to draw, manipulate, and analyze trendlines on real-time cryptocurrency data from Binance API.

## 🚀 Features

### Core Functionality
- **Real-time Data**: Live ETH/USDT candlestick data from Binance API
- **Interactive Trendlines**: Draw, edit, and delete custom trendlines
- **Persistent Storage**: Trendlines automatically saved to localStorage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Trendline Capabilities
> ⚠️ **Important**: Turn ON drawing mode before attempting to make trendlines
> ⚠️ **Important**: Turn OFF drawing mode before attempting to move trendlines or delete trendlines
- ✅ **Drawing Mode**: Click once for start point and 2nd time for end point to create trendlines
- ✅ **Drag & Drop**: Move entire trendlines or individual endpoints
- ✅ **Line Extension**: Extend trendlines from either end
- ✅ **Visual Feedback**: Hover effects and control points
- ✅ **Coordinate Display**: Real-time coordinate information
- ✅ **Color Coding**: Automatic random color assignment
- ✅ **Bulk Operations**: Clear all trendlines at once

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jain-Moksh/Tusta.git
   cd trading-chart
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## 🎯 How to Use

### Getting Started

1. **Wait for Data Loading**: The chart will automatically load ETH/USDT data from Binance
2. **Chart Ready**: Once loaded, you'll see the candlestick chart with controls

### Drawing Trendlines

1. **Enable Drawing Mode**
   - Click the **"Drawing ON"** button to activate drawing mode
   - The button will show "Drawing OFF" when active
   - Your cursor will change to a crosshair

2. **Create a Trendline**
   - Click once on the chart to set the start point
   - Move your mouse to the desired end point
   - Click again to complete the trendline
   - The trendline will automatically appear with a random color

3. **Disable Drawing Mode**
   - Click **"Drawing OFF"** to exit drawing mode
   - This enables interaction with existing trendlines

### Interacting with Trendlines

#### Selecting Trendlines
- **Click** on any trendline to select it
- Selected trendlines will be highlighted and show control points
- **Double-click** on a trendline to view its coordinates

#### Moving Trendlines
> ⚠️ **Important**: Turn OFF drawing mode before attempting to move trendlines

1. **Move Entire Trendline**
   - Click and drag anywhere on the trendline body
   - The entire line will move while maintaining its angle

2. **Move Individual Points**
   - Hover over a trendline to see circular control points
   - Click and drag the control points to move start/end positions

3. **Extend Trendlines**
   - Hover near the ends of a trendline to see dashed extension zones
   - Click and drag in these zones to extend or shorten the line

#### Visual Indicators
- **Solid Line**: The main trendline
- **Circular Points**: Draggable start/end points (visible on hover/selection)
- **Dashed Lines**: Extension zones for line extension
- **Color Dot**: Trendline color indicator in the summary panel

### Deleting Trendlines

#### Individual Deletion
1. **Hover Method**
   - Hover over any trendline (with drawing mode OFF)
   - Click the red trash icon that appears

2. **Summary Panel Method**
   - Scroll down to the "Active Trendlines" section
   - Click the **"Delete"** button next to any trendline

#### Bulk Deletion
- Click the **"Clear All (X)"** button to delete all trendlines at once
- The number in parentheses shows the current trendline count

### Viewing Trendline Information

#### Coordinate Display
- **No Trendlines**: Shows "No trendline created" message
- **With Trendlines**: Displays active trendlines summary

#### Trendline Summary Panel
- **Color Indicator**: Visual color reference
- **Timestamps**: Start and end dates
- **Price Points**: Start and end price values
- **Selection**: Click any trendline in the list to select it on the chart

## 🛠️ Technical Details

### Architecture
- **Frontend**: React 18 with Next.js 14 App Router
- **Styling**: Tailwind CSS for responsive design
- **Charts**: ApexCharts with react-apexcharts
- **Canvas**: HTML5 Canvas for trendline overlay
- **Storage**: Browser localStorage for persistence

### Data Source
- **API**: Binance Public API (`/api/v3/klines`)
- **Symbol**: ETH/USDT
- **Interval**: 1 day
- **Limit**: 100 recent candles

### Key Components
- **TradingChart.jsx**: Main chart component with trendline logic
- **Canvas Overlay**: Custom drawing layer for trendlines
- **State Management**: React hooks for real-time updates
- **Coordinate System**: Automatic conversion between screen and chart coordinates

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎨 Features in Detail

### Responsive Design
- **Desktop**: Full feature set with hover interactions
- **Tablet**: Touch-optimized controls and larger touch targets
- **Mobile**: Simplified interface with essential features

### Performance Optimizations
- **Canvas Rendering**: Hardware-accelerated drawing
- **Event Debouncing**: Smooth drag operations
- **Memory Management**: Efficient state updates
- **API Caching**: Reduced network requests

### Accessibility
- **Keyboard Navigation**: Tab through interactive elements
- **Screen Reader Support**: ARIA labels and descriptions
- **High Contrast**: Clear visual indicators
- **Touch Support**: Mobile-friendly interactions

## 🚀 Deployment

### Live Demo
🌐 **Live Application**: [https://your-app.vercel.app](https://your-app.vercel.app)

### Deploy Your Own

#### Vercel (Recommended)
1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project
4. Deploy automatically

#### Manual Deployment
```bash
npm run build
npm run start
```

## 📝 Usage Tips

### Best Practices
1. **Always disable drawing mode** before interacting with existing trendlines
2. **Use hover effects** to identify interactive areas
3. **Check the summary panel** for detailed trendline information
4. **Save important analysis** by taking screenshots (trendlines persist automatically)

### Troubleshooting
- **Trendlines not visible**: Ensure chart data has loaded completely
- **Can't drag trendlines**: Verify drawing mode is turned OFF
- **Performance issues**: Try clearing old trendlines with "Clear All"
- **Data not loading**: Check internet connection and try refreshing

### Keyboard Shortcuts
- **Escape**: Exit drawing mode
- **Delete**: Remove selected trendline (when implemented)
- **Ctrl+Z**: Undo last action (when implemented)

## 🔮 Future Enhancements

- [ ] Multiple timeframes (1h, 4h, 1w)
- [ ] Additional drawing tools (rectangles, circles)
- [ ] Fibonacci retracement levels
- [ ] Price alerts on trendline breaks
- [ ] Export/import trendline configurations
- [ ] Multiple cryptocurrency pairs
- [ ] Advanced technical indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Binance API](https://binance-docs.github.io/apidocs/) for real-time cryptocurrency data
- [ApexCharts](https://apexcharts.com/) for the charting library
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
- [Vercel](https://vercel.com/) for hosting and deployment

---

**Built with ❤️ using React, Next.js, and modern web technologies**
```

This comprehensive README.md file includes:

✅ **Complete setup instructions** - From cloning to running locally  
✅ **Detailed usage guide** - Step-by-step instructions for all features  
✅ **Technical documentation** - Architecture and implementation details  
✅ **Deployment information** - Live demo and deployment instructions  
✅ **Troubleshooting section** - Common issues and solutions  
✅ **Future roadmap** - Planned enhancements  
✅ **Professional formatting** - Clean markdown with proper sections  

The README covers all the functionality you mentioned and provides a professional, comprehensive guide for users and developers.

