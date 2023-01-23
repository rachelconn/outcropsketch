#!/bin/bash

NUM_THREADS=`grep -c ^processor /proc/cpuinfo`

for i in `seq 0 $(expr $NUM_THREADS - 1)`
do
    ts-node ./src/utils/jsonToMask.ts $NUM_THREADS $i &
done
wait
