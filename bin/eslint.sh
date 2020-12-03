#!/usr/bin/env sh
eslint \
  --report-unused-disable-directives \
  --max-warnings 0 \
  "$@"