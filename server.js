/**
 * Created by kiroshan on 2017/10/03.
 */
// server.js

    // setup ===============================
    var express = require('express');
    var app = express();
    var mongoose = require('mongoose');
   // var MongoClient = require('mongodb').MongoClient;
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var port = process.env.PORT || 1337;

    // configuration

    var mongodbUri = 'mongodb://kiro:1234@ds159254.mlab.com:59254/dev';

    mongoose.connect(mongodbUri, { useMongoClient: true });

    app.use(express.static(__dirname + '/public'));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({type: 'application/vnd.api+json'}));
    app.use(methodOverride());

    var Todo = mongoose.model('Todo', {
        text : String
    });
    // routes
        // api ----------------------------
        //  get all todos
        app.get('/api/todos', function(req,res){
            //use mongoose to get all todos in the database
            Todo.find(function(err, todos){
                if(err)
                res.send(err);

                res.json(todos);
            });
        });

        app.post('/api/todos', function(req, res){

            Todo.create({
                text : req.body.text,
                done : false
            }, function(err, todo){
                if(err)
                    res.send(err);

                Todo.find(function(err, todos){
                    if (err)
                        res.send(err);
                    res.json(todos);
                });
            });
        });

        app.delete('/api/todos/:todo_id', function(req, res){
            Todo.remove({
                _id : req.params.todo_id
            }, function(err, todos){
                if(err)
                res.send(err);

                Todo.find(function(err, todos){
                    if(err)
                    res.send(err)
                    res.json(todos);
                });
            });
        });

        app.get('*', function(req, res){
           res.sendfile('./public/index.html');

        });

    app.listen(port);
    console.log(port);