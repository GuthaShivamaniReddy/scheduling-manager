#!/bin/bash

set -e

# Helper functions for output (works with or without gum)
print_step() {
  if command -v gum &> /dev/null; then
    gum style --foreground 212 --bold "$1"
  else
    echo "🚀 $1"
  fi
}

print_success() {
  if command -v gum &> /dev/null; then
    gum style --foreground 46 "$1"
  else
    echo "✅ $1"
  fi
}

print_info() {
  if command -v gum &> /dev/null; then
    gum style --foreground 220 "$1"
  else
    echo "ℹ️  $1"
  fi
}

print_error() {
  if command -v gum &> /dev/null; then
    gum style --foreground 196 --bold "$1"
  else
    echo "❌ $1"
  fi
}

spin() {
  local title="$1"
  shift
  if command -v gum &> /dev/null; then
    gum spin --spinner dot --title "$title" -- "$@"
  else
    echo "$title"
    "$@"
  fi
}

confirm() {
  if command -v gum &> /dev/null; then
    gum confirm "$1"
  else
    read -p "$1 (y/n): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
  fi
}

# Check for Docker
if ! command -v docker &> /dev/null; then
  print_error "Docker is not installed. Please install Orbstack or Docker Desktop"
  exit 1
fi

# Check for Docker Compose v2
if ! docker compose version &> /dev/null; then
  print_error "Docker Compose v2 is not installed. Please install Orbstack or Docker Desktop which includes Docker Compose v2."
  exit 1
fi

print_step "🚀 Setting up vitalize-interview..."

# Step 1: Install bun
if ! command -v bun &> /dev/null; then
  if spin "📦 Step 1: Installing Bun..." bash -c "curl -fsSL https://bun.sh/install | bash"; then
    # Add bun to PATH for current session if not already there
    export PATH="$HOME/.bun/bin:$PATH"
    print_success "📦 Step 1: Bun installed"
  else
    print_error "❌ Failed to install Bun"
    exit 1
  fi
else
  print_success "📦 Step 1: Bun already installed"
fi

# Step 2: Install dependencies
if spin "📦 Step 2: Installing dependencies..." bun install; then
  print_success "📦 Step 2: Dependencies installed"
else
  print_error "❌ Failed to install dependencies"
  exit 1
fi

# Step 3: Start PostgreSQL with Docker
# Using down then up -d will restart the container even if it's already running
if spin "🔄 Step 3: Restarting PostgreSQL with Docker..." bash -c "docker compose down 2>/dev/null || true; docker compose up -d postgres"; then
  print_success "🔄 Step 3: PostgreSQL container restarted"
else
  print_error "❌ Failed to restart PostgreSQL container"
  print_error "Check logs with: docker compose logs postgres"
  exit 1
fi

# Step 4: Wait for PostgreSQL to be ready
if spin "⏳ Step 4: Waiting for PostgreSQL to be ready..." bash -c '
  MAX_RETRIES=30
  RETRY_COUNT=0
  while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    # Check if container exists and is running
    if docker ps --format "{{.Names}}" | grep -q "^vitalize-interview-postgres$"; then
      # Check if PostgreSQL is ready
      if docker exec vitalize-interview-postgres pg_isready -U postgres &> /dev/null; then
        exit 0
      fi
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 1
  done
  exit 1
'; then
  print_success "⏳ Step 4: PostgreSQL is ready"
else
  print_error "❌ PostgreSQL failed to start in time"
  print_error "Check container status with: docker ps -a | grep vitalize-interview-postgres"
  exit 1
fi

# Step 5: Run migrations
if spin "📊 Step 5: Running database migrations..." bun migrate; then
  print_success "📊 Step 5: Database migrations completed"
else
  print_error "❌ Failed to run migrations"
  exit 1
fi

# Step 6: Seed database
if spin "🌱 Step 6: Seeding database..." bun seed; then
  print_success "🌱 Step 6: Database seeded"
else
  print_error "❌ Failed to seed database"
  exit 1
fi

# Success message
echo ""
print_success "✨ Setup complete! 🎉"
if command -v gum &> /dev/null; then
  gum style --foreground 255 "You're all set to start the interview!"
  gum style \
    --foreground 39 --border-foreground 39 --border double \
    --align center --width 50 --margin "1 2" --padding "2 2" \
    'Start dev: bun dev' 'Run tests: bun test'
else
  echo "You're all set to start the interview!"
  echo ""
  echo "Start dev: bun dev"
  echo "Run tests: bun test"
fi

if confirm "Do you want to start dev?"; then
  bun dev
fi
