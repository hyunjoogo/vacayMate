#!/bin/bash
read -p "Enter the port number you want to close: " port
sudo lsof -i :$port | awk 'NR!=1 {print $2}' | xargs kill -9
