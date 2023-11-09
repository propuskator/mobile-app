#!/bin/bash

if [ -z "$BUILD_VERSION" ]; then
    echo "BUILD_VERSION should be specified in env!"
    exit 1
fi

if [ -z "$BUILD_COMMENT" ]; then
    echo "BUILD_COMMENT should be specified in env!"
    exit 1
fi

echo "BUILD_VERSION - $BUILD_VERSION"
echo "BUILD_COMMENT - $BUILD_COMMENT"

echo ""
echo "Success!"