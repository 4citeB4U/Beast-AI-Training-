#!/bin/bash
# Beast AI Heroes Academy - Quick Start Script
# This script helps you get both the frontend and backend running

echo "🦸 Beast AI Heroes Academy - Quick Start"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js detected: $(node --version)"
echo ""

# Function to print instructions
print_instructions() {
    echo ""
    echo "📝 NEXT STEPS:"
    echo "1. Create backend/.env.local with your OAuth credentials"
    echo "2. Run: npm install (in both frontend and backend directories)"
    echo "3. Start backend: cd backend && npm run dev"
    echo "4. In another terminal, start frontend: npm run dev"
    echo "5. Open http://localhost:3001 in your browser"
    echo ""
    echo "📚 For detailed setup instructions, see SETUP_GUIDE.md"
    echo ""
}

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Make sure you're in the project root."
    exit 1
fi

# Check if frontend src directory exists
if [ ! -d "src" ]; then
    echo "❌ Frontend src directory not found. Make sure you're in the project root."
    exit 1
fi

echo "✓ Project structure detected"
echo ""

# Check if .env files exist
if [ ! -f "backend/.env.local" ]; then
    echo "⚠️  backend/.env.local not found"
    echo "   Copying from template..."
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env.local
        echo "   ✓ Created backend/.env.local"
        echo "   ⚠️  You must fill in OAuth credentials before starting!"
    fi
fi

if [ ! -f ".env.local" ]; then
    echo "⚠️  Frontend .env.local not found"
    echo "   Copying from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "   ✓ Created .env.local"
    fi
fi

echo ""

# Check backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    echo "✓ Backend dependencies installed"
fi

# Check frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo "✓ Frontend dependencies installed"
fi

echo ""
echo "✅ Setup complete!"
print_instructions

# Optional: Start services if requested
read -p "Would you like to start the services? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting Backend and Frontend..."
    echo ""
    echo "Backend will run on http://localhost:3000"
    echo "Frontend will run on http://localhost:3001"
    echo ""
    echo "Press Ctrl+C to stop both services"
    echo ""
    
    # Start backend in background
    (cd backend && npm run dev) &
    BACKEND_PID=$!
    
    # Wait a bit for backend to start
    sleep 2
    
    # Start frontend
    npm run dev
    
    # Cleanup
    kill $BACKEND_PID 2>/dev/null || true
fi
