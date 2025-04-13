# Catapult 🚀

Catapult is a full-stack e-commerce analytics platform that helps you discover and track trending products across multiple marketplaces. It combines real-time data analysis with AI-powered trend prediction to give you actionable insights for your e-commerce business.

## Features ✨

- **Trend Analysis**: Advanced AI algorithms to identify emerging product trends
- **Multi-marketplace Integration**: Data from TikTok, AliExpress, and CJ Dropshipping
- **Real-time Analytics**: Live tracking of product performance metrics
- **Sales Projections**: AI-powered sales forecasting with velocity tracking
- **Modern UI/UX**: Responsive design with dark/light mode support
- **Interactive Graphs**: Visual representation of sales and trend data

## Tech Stack 🛠️

### Backend
- Python 3.10+
- Flask
- SQLAlchemy
- MySQL
- OpenAI API
- Various marketplace APIs

### Frontend
- React
- Vite
- TailwindCSS
- Recharts
- React Router

## Getting Started 🏁

### Prerequisites

- Python 3.10 or higher
- Node.js 16 or higher
- MySQL database
- API keys for:
  - OpenAI
  - CJ Dropshipping
  - AliExpress (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Catapult.git
cd Catapult
```

2. Set up Python environment and install dependencies:
```bash
cd App
pip install -r requirements.txt
```

3. Set up environment variables:
Create a .env file in the root directory with:
```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306
OPENAI_API_KEY=your_openai_key
CJ_API_TOKEN=your_cj_token
```

4. Install frontend dependencies:
```bash
cd View
npm install
```

5. Initialize the database:
```bash
cd ../Database
python init_db.py
```

### Running the Application

1. Start the backend server:
```bash
cd App
python app.py
```

2. Start the frontend development server:
```bash
cd View
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure 📁

```
App/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── Database/          # Database configurations and models
├── Model/            # AI models and data processing
└── View/             # React frontend application
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details