#!/bin/sh

TIME_LIMIT=1

timeout $TIME_LIMIT javac Main.java && timeout $TIME_LIMIT java Main < input.txt

exit $?
