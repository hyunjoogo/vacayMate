#!/bin/bash
# Start MySQL
mysql.server start

# Start Redis and Redis Commander
redis-server & redis-commander

