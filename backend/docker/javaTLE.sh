#!/bin/sh

"$@" &

MAIN_PID=$!

TIME_LIMIT=4

sleep $TIME_LIMIT

if kill -0 $MAIN_PID 2>/dev/null; then
    echo "Time limit exceeded, killing process..."
    kill -9 $MAIN_PID
fi

wait $MAIN_PID
