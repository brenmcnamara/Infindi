#! /bin/sh

# Waiting for yarn support of this: https://github.com/yarnpkg/yarn/issues/1722
( ls -l node_modules ; ls -l node_modules/@* ) | grep ^l