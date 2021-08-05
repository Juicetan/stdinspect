#!/usr/bin/env node

var split = require('split');
var pipe = process.stdin.pipe(split());

var result = {
  cache: [],
  notJSON: '',
  record: function(json){
    this.cache.push(json);
    if(this.cache.length > 20){
      this.cache.shift();
    }
  },
  print: function(){
    console.log('\n============ previous lines ============');
    this.cache.forEach(function(json){
      console.log(json);
    });
    console.log('\n============ not json ============');
    console.log(this.notJSON);
  }
};

pipe.on('data', function(line){
  try{
    var json = JSON.parse(line);
    result.record(json);
  } catch(e){
    result.notJSON = line;
    result.print();
    process.exit();
  }
});

pipe.on('end', function(){
  console.log('> end of stream');
});
