#!/bin/bash

# AI Agent Platform Startup Script (.command file)
# Double-click to run

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function: Print colored messages
print_message() {
    echo -e "${2}[$(date '+%H:%M:%S')] $1${NC}"
}

# Function: Check if port is in use
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        return 0  # Port in use
    else
        return 1  # Port free
    fi
}

# Function: Kill processes using port
kill_port() {
    local port=$1
    print_message "Port $port is in use, stopping processes..." $YELLOW
    
    local pids=$(lsof -ti :$port)
    if [ ! -z "$pids" ]; then
        echo $pids | xargs kill -9 2>/dev/null
        sleep 2
        print_message "Stopped processes on port $port" $GREEN
    fi
}

clear

print_message "🤖 AI Agent Platform Startup" $BLUE
print_message "================================" $BLUE
print_message "Working directory: $SCRIPT_DIR" $BLUE

# Check if in correct directory
if [ ! -f "package.json" ]; then
    print_message "❌ Error: Not in project root directory" $RED
    print_message "Script location: $SCRIPT_DIR" $RED
    read -p "Press any key to exit..."
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_message "❌ Error: Node.js not installed" $RED
    print_message "Please install Node.js from https://nodejs.org" $RED
    read -p "Press any key to exit..."
    exit 1
fi

print_message "✅ Node.js version: $(node --version)" $GREEN
print_message "✅ npm version: $(npm --version)" $GREEN

# Select port
DEFAULT_PORT=3001
PORT=$DEFAULT_PORT

print_message "Checking port availability..." $YELLOW

if check_port $PORT; then
    print_message "Port $PORT is in use" $YELLOW
    kill_port $PORT
    
    if check_port $PORT; then
        for p in 3002 3003 3004 3005; do
            if ! check_port $p; then
                PORT=$p
                print_message "Using alternative port $PORT" $GREEN
                break
            fi
        done
        
        if check_port $PORT; then
            print_message "❌ Cannot find available port" $RED
            read -p "Press any key to exit..."
            exit 1
        fi
    fi
fi

print_message "✅ Using port: $PORT" $GREEN

# Check dependencies
if [ ! -d "node_modules" ]; then
    print_message "📦 First run - installing dependencies..." $YELLOW
    npm install
    if [ $? -ne 0 ]; then
        print_message "❌ Failed to install dependencies" $RED
        read -p "Press any key to exit..."
        exit 1
    fi
    print_message "✅ Dependencies installed" $GREEN
fi

# Check database
if [ ! -f "prisma/dev.db" ]; then
    print_message "🗄️ First run - initializing database..." $YELLOW
    npx prisma db push
    npx prisma db seed
    if [ $? -ne 0 ]; then
        print_message "❌ Database initialization failed" $RED
        read -p "Press any key to exit..."
        exit 1
    fi
    print_message "✅ Database initialized" $GREEN
else
    print_message "✅ Database exists" $GREEN
fi

# Generate Prisma client
print_message "🔄 Updating Prisma client..." $YELLOW
npx prisma generate > /dev/null 2>&1

print_message "🚀 Starting development server..." $GREEN
print_message "================================" $BLUE
print_message "🌐 Server started! Access URLs:" $GREEN
print_message "   📱 Homepage: http://localhost:$PORT" $BLUE
print_message "   ⚙️  Admin Panel: http://localhost:$PORT/admin/login" $BLUE
print_message "   👤 Admin Email: admin@example.com" $BLUE
print_message "   🔑 Password: admin123" $BLUE
print_message "================================" $BLUE
print_message "💡 Tips:" $YELLOW
print_message "   • Open links in your browser" $YELLOW
print_message "   • Don't click links in Obsidian" $YELLOW
print_message "   • Press Ctrl+C to stop server" $YELLOW
print_message "   • Closing this window stops server" $YELLOW
print_message "================================" $BLUE
echo ""

# Auto-open browser (optional)
read -p "Open homepage in browser automatically? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "http://localhost:$PORT"
fi

# Start server
npm run dev -- --port $PORT

# After server stops
echo ""
print_message "🛑 Server stopped" $YELLOW
read -p "Press any key to close this window..."