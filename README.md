# Real Estate Analytics Web App

A web application for displaying real estate rent analytics data.

## Environment Setup

1. Clone the repository
2. Copy the environment template:
   ```bash
   cd backend
   cp .env.example .env
   ```
3. Update the `.env` file with your Supabase credentials:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon key (public)

## Development

### Backend
1. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   .\venv\Scripts\activate  # Windows
   ```
2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Start the server:
   ```bash
   python run.py
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```

## Security Notes

- The application uses Supabase's Row Level Security (RLS)
- Only read access is permitted through the anon key
- All sensitive information should be kept in `.env` files
- Never commit `.env` files to the repository 