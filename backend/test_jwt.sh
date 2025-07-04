#!/bin/bash
# Automated end-to-end JWT test script for Bookly backend
# Requires 'jq' for JSON parsing

BASE_URL="http://localhost:8080"

# 1. Clear all users
echo "🧹 Deleting all users..."
curl -s -X DELETE $BASE_URL/api/users/deleteAllUsers && echo -e "\n"

# 2. Create test users
USERS=(
  '{"email": "alice@example.com", "password": "password123", "firstName": "Alice", "lastName": "Anderson", "username": "alice", "birthday": "1990-01-01", "profilePictureUrl": ""}'
  '{"email": "bob@example.com", "password": "password456", "firstName": "Bob", "lastName": "Brown", "username": "bob", "birthday": "1991-02-02", "profilePictureUrl": ""}'
  '{"email": "charlie@example.com", "password": "password789", "firstName": "Charlie", "lastName": "Clark", "username": "charlie", "birthday": "1992-03-03", "profilePictureUrl": ""}'
)

for i in "${!USERS[@]}"; do
  echo "📝 Creating user $((i+1)): $(echo ${USERS[$i]} | jq -r .email)"
  curl -s -X POST $BASE_URL/api/users/signup \
    -H "Content-Type: application/json" \
    -d "${USERS[$i]}" | jq .
  echo ""
done

# 3. Test logins and extract JWTs
LOGIN_EMAILS=("alice@example.com" "bob@example.com" "charlie@example.com")
LOGIN_PASSWORDS=("password123" "password456" "password789")
JWT_TOKENS=()

for i in "${!LOGIN_EMAILS[@]}"; do
  echo "🔑 Logging in as ${LOGIN_EMAILS[$i]}..."
  RESPONSE=$(curl -s -X POST $BASE_URL/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"email": "'${LOGIN_EMAILS[$i]}'", "password": "'${LOGIN_PASSWORDS[$i]}'"}')
  echo "$RESPONSE" | jq .
  TOKEN=$(echo "$RESPONSE" | jq -r .token)
  JWT_TOKENS+=("$TOKEN")
  echo ""
done

# 4. Test login with wrong password
echo "🚫 Login with wrong password (should fail):"
curl -s -X POST $BASE_URL/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "bob@example.com", "password": "wrongpassword"}' | jq .
echo ""

# 5. Test protected endpoint with valid JWT
for i in "${!LOGIN_EMAILS[@]}"; do
  echo "🔒 Testing /profile with ${LOGIN_EMAILS[$i]}'s JWT..."
  curl -s -X GET $BASE_URL/api/users/profile \
    -H "Authorization: Bearer ${JWT_TOKENS[$i]}" | jq .
  echo ""
done

echo "✅ All tests complete."
echo ""
echo "7. Test without token (should fail):"
echo "curl -X GET $BASE_URL/api/users/profile"

# One-liner versions for easy copy-paste
echo ""
echo "🚀 ONE-LINER VERSIONS (copy individually):"
echo "==========================================="
echo ""
echo "Login Bob:"
echo "curl -X POST $BASE_URL/api/users/login -H \"Content-Type: application/json\" -d '{\"email\":\"bob@example.com\",\"password\":\"password456\"}'"
echo ""
echo "Login Test User:"
echo "curl -X POST $BASE_URL/api/users/login -H \"Content-Type: application/json\" -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'"
echo ""
echo "Create New User:"
echo "curl -X POST $BASE_URL/api/users/signup -H \"Content-Type: application/json\" -d '{\"email\":\"newuser@example.com\",\"password\":\"mynewpassword123\",\"firstName\":\"New\",\"lastName\":\"User\"}'"
echo ""
echo "Test Protected (replace TOKEN):"
echo "curl -X GET $BASE_URL/api/users/profile -H \"Authorization: Bearer TOKEN\""