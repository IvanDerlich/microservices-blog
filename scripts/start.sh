#!/bin/bash

pnpm -r --parallel \
  --filter posts \
  --filter comments \
  --filter query \
  --filter event-bus \
  --filter client \
  --filter moderation \
  --stream start
