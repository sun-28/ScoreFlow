#!/bin/sh

TIME_LIMIT=1

timeout $TIME_LIMIT python Main.py < input.txt

exit $?
