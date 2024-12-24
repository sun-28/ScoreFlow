#!/bin/sh

TIME_LIMIT=1

timeout $TIME_LIMIT g++ Main.cpp -o Main && timeout $TIME_LIMIT ./Main < input.txt

exit $?