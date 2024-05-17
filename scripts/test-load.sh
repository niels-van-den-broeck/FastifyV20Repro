#!/bin/bash
for i in {1..10000}
do
  curl --request GET http://0.0.0.0:3000/;
done
