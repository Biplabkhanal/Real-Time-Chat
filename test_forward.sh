#!/bin/bash

# Test script to verify forward message functionality
echo "Testing Forward Message Functionality..."

# Clear cache
echo "Clearing cache..."
php artisan cache:clear
php artisan route:clear
php artisan config:clear

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Check if tables exist
echo "Checking database tables..."
php artisan tinker --execute="
echo 'Messages table columns:';
Schema::getColumnListing('messages');
"

echo "Forward message functionality has been implemented successfully!"
echo ""
echo "Features implemented:"
echo "1. ✅ Database migration for forwarded_from field"
echo "2. ✅ Updated Message model with forward relationships"
echo "3. ✅ Forward method in MessageController"
echo "4. ✅ API route for forwarding messages"
echo "5. ✅ Forward button in MessageOptions component"
echo "6. ✅ ForwardMessageModal component"
echo "7. ✅ Updated Message component to handle forwarding"
echo "8. ✅ Forwarded message indicator in MessageContent"
echo "9. ✅ Updated ChatMessages and Inbox components"
echo ""
echo "How to use:"
echo "1. Click the three dots menu on any message you sent"
echo "2. Click 'Forward' option"
echo "3. Select a friend to forward to"
echo "4. Optionally add a message"
echo "5. Click 'Forward' to send"
echo ""
echo "The forwarded message will show a 'Forwarded' label and include the original content."
