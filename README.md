## connect-gitsha

Add an 'X-Git-SHA' header to each response

## installation

    $ npm install connect-gitsha

## usage

Like any other middleware:

    var express = require('express')
      , gitsha  = require('gitsha')
    ;

    var app = express();

    app.use(gitsha());

## Why?

Because it's nice to know what rev of your software is running

## requirements

1. git needs to be in the path of the application user
2. the working directory needs to be within the git repository
