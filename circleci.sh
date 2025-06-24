#!/bin/bash

exec < /dev/tty
export $(cat .env | xargs)


case $1 in
    test)
        make run-test
        ;;
    coverage)
        make copy-coverage
        ;;
    clean)
        make clean
        ;;
    * )
        make up
esac
