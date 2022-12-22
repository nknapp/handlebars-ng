#!/bin/bash

SOURCE_FILE=$1
SOURCE_TYPE=$2
TARGET_FILE=$3

ts-json-schema-generator -f tsconfig.json -p "${SOURCE_FILE}" -t "${SOURCE_TYPE}" -o "${TARGET_FILE}"
git add "${TARGET_FILE}"