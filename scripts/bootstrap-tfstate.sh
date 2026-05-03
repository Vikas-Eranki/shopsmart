#!/usr/bin/env bash
# bootstrap-tfstate.sh: creates the S3 bucket and DynamoDB table for Terraform remote state.
# Run once before the first terraform init.
# Usage: AWS_REGION=us-east-1 ./scripts/bootstrap-tfstate.sh
set -euo pipefail

REGION="${AWS_REGION:-us-east-1}"
BUCKET="shopsmart-tfstate-${REGION}"
TABLE="shopsmart-tfstate-lock"

echo "Creating Terraform state S3 bucket: $BUCKET"
if aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  echo "Bucket already exists, skipping."
else
  if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket \
      --bucket "$BUCKET" \
      --region "$REGION"
  else
    aws s3api create-bucket \
      --bucket "$BUCKET" \
      --region "$REGION" \
      --create-bucket-configuration LocationConstraint="$REGION"
  fi
  echo "Bucket created."
fi

echo "Enabling versioning on $BUCKET"
aws s3api put-bucket-versioning \
  --bucket "$BUCKET" \
  --versioning-configuration Status=Enabled

echo "Enabling AES-256 encryption on $BUCKET"
aws s3api put-bucket-encryption \
  --bucket "$BUCKET" \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"},
      "BucketKeyEnabled": true
    }]
  }'

echo "Blocking all public access on $BUCKET"
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

echo "Creating DynamoDB lock table: $TABLE"
if aws dynamodb describe-table --table-name "$TABLE" --region "$REGION" 2>/dev/null; then
  echo "Table already exists, skipping."
else
  aws dynamodb create-table \
    --table-name "$TABLE" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "$REGION"
  echo "DynamoDB table created."
fi

echo ""
echo "Terraform remote state backend is ready."
echo "  Bucket : s3://$BUCKET"
echo "  Table  : $TABLE"
echo ""
echo "Required GitHub Secrets:"
echo "  AWS_ACCESS_KEY_ID     = <from AWS Academy Lab>"
echo "  AWS_SECRET_ACCESS_KEY = <from AWS Academy Lab>"
echo "  AWS_SESSION_TOKEN     = <from AWS Academy Lab>"
echo "  AWS_REGION            = $REGION"
