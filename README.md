# FinPort - Financial Portfolio Management System

A comprehensive web-based application for managing financial portfolios, built with Angular. This application allows users to track their investments, view performance reports, and make informed financial decisions.

## 🚀 Features

### Core Functionality
- **Dashboard**: Interactive portfolio overview with key metrics and performance indicators
- **Investment Management**: Add, view, and manage investment holdings
- **Real-time Updates**: Simulated real-time price updates for portfolio values
- **Performance Analytics**: Track gains/losses and performance metrics
- **Asset Allocation**: Visual representation of portfolio diversification

### Technical Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive client-side validation with Angular reactive forms
- **State Management**: Modern Angular signals and observables for reactive state
- **Lazy Loading**: Optimized routing with lazy-loaded components
- **Custom Pipes & Directives**: Reusable formatting and UI enhancement utilities
- **TypeScript**: Full type safety and modern JavaScript features
- **Unit Tests**: Comprehensive test coverage for services and components

## 🛠️ Technology Stack

- **Frontend Framework**: Angular 20.3.0
- **Language**: TypeScript 5.9.2
- **Styling**: CSS3 with modern responsive design
- **State Management**: Angular Signals & RxJS Observables
- **Testing**: Jasmine & Karma
- **Build Tool**: Angular CLI

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Angular CLI**: Version 20.3.3 or higher

### Installing Prerequisites

1. **Install Node.js**:
   - Visit [nodejs.org](https://nodejs.org/)
   - Download and install the LTS version
   - Verify installation: `node --version` and `npm --version`

2. **Install Angular CLI**:
   ```bash
   npm install -g @angular/cli@20.3.3
   ```
   - Verify installation: `ng version`

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd finport
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200/`

### 4. Build for Production
```bash
npm run build
# or
ng build
```

### 5. Run Tests
```bash
npm test
# or
ng test
```

## 📱 Application Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/           # Portfolio dashboard
│   │   ├── investment-form/     # Add investment form
│   │   └── navigation/          # Navigation component
│   ├── models/                  # TypeScript interfaces
│   ├── pipes/                   # Custom pipes
│   ├── directives/              # Custom directives
│   ├── services/                # Business logic services
│   └── app.routes.ts           # Routing configuration
├── styles.css                  # Global styles
└── index.html                  # Main HTML file
```

## 🎯 Key Components

### Dashboard Component
- **Location**: `src/app/components/dashboard/`
- **Features**: Portfolio overview, performance metrics, asset allocation
- **Responsive**: Mobile-first design with breakpoints

### Investment Form Component
- **Location**: `src/app/components/investment-form/`
- **Features**: Form validation, review step, error handling
- **Validation**: Custom validators for different asset types

### Services
- **PortfolioService**: Manages portfolio data and calculations
- **ValidationService**: Handles form validation logic

### Pipes & Directives
- **CurrencyPipe**: Formats monetary values
- **PercentagePipe**: Formats percentage values
- **AssetTypePipe**: Formats asset type labels
- **HighlightDirective**: Dynamic styling based on values

## 🔧 Configuration

### Environment Setup
The application uses default Angular configuration. No additional environment setup is required.

### Mock Data
The application includes mock data for demonstration purposes:
- Sample investments (AAPL, GOOGL, SPY)
- Simulated price updates every 5 seconds
- Mock benchmark data (S&P 500)

## 📊 Usage Guide

### Adding an Investment
1. Navigate to "Add Investment" from the navigation menu
2. Fill in the required fields:
   - Asset Type (Stock, Bond, ETF, etc.)
   - Symbol (1-5 uppercase letters)
   - Investment Name
   - Quantity
   - Purchase Price
   - Purchase Date
3. Review your input before submission
4. Submit to add to your portfolio

### Viewing Portfolio
1. The dashboard displays:
   - Total portfolio value
   - Gain/loss summary
   - Asset allocation breakdown
   - Top and worst performers
   - Detailed holdings table

### Navigation
- **Dashboard**: Main portfolio overview
- **Add Investment**: Form to add new investments
- **Mobile Menu**: Hamburger menu for mobile devices

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
ng test

# Run tests with coverage
ng test --code-coverage
```

### Test Coverage
- **Services**: PortfolioService, ValidationService
- **Components**: Dashboard, InvestmentForm
- **Pipes**: Currency, Percentage, AssetType
- **Directives**: Highlight

## 🎨 Styling & Responsive Design

### Breakpoints
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

### Design System
- **Colors**: Modern blue and gray palette
- **Typography**: Inter font family
- **Spacing**: Consistent 8px grid system
- **Components**: Card-based layout with shadows

## 🔍 Troubleshooting

### Common Issues

1. **Port not available (4200)**:
   ```bash
   ng serve --port 4201
   ```

2. **Node modules issues**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Angular CLI version mismatch**:
   ```bash
   npm install -g @angular/cli@latest
   ```

4. **Build errors**:
   ```bash
   ng build --configuration development
   ```

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 Performance

### Optimization Features
- **Lazy Loading**: Components loaded on demand
- **OnPush Change Detection**: Optimized change detection strategy
- **Signal-based State**: Efficient reactive state management
- **Minimal Bundle Size**: Tree-shaking and code splitting

### Bundle Analysis
```bash
ng build --stats-json
npx webpack-bundle-analyzer dist/finport/stats.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review Angular documentation: [angular.dev](https://angular.dev)

## 🔄 Version History

- **v1.0.0**: Initial release with core portfolio management features
- Dashboard with real-time updates
- Investment form with validation
- Responsive design
- Unit test coverage

---

**Note**: This application uses mock data for demonstration purposes. In a production environment, you would integrate with real financial APIs and backend services.