#!/bin/sh
"$@" &
MAIN_PID=$!

TIME_LIMIT=4

sleep $TIME_LIMIT

if ps -p $MAIN_PID > /dev/null
then
   echo "Time limit exceeded, killing process..."
   kill -9 $MAIN_PID
fi

wait $MAIN_PID
