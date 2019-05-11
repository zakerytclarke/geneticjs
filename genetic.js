
function GeneticJS(generator,fitness,options){

  var size=1000;
  if(options.size!=null){
    size=options.size;
  }


  this.generation = 0;


  const POPULATIONSIZE = size;
  const ELIMINATIONPERCENTAGE = 0.6;
  const KEEP = POPULATIONSIZE * (1 - ELIMINATIONPERCENTAGE);



  this.population = [];
  for(var i = 0; i < POPULATIONSIZE; i++){
    this.population.push(new Organism(generator()));
  }


  //Initialize Population

  this.nextGeneration=function(){

    this.population.sort(function(x,y){
      if(x.fitness>y.fitness){
        return -1;
      }else{
        return 1;
      }
    });


    this.population = this.population.slice(0,KEEP);

    while(this.population.length < POPULATIONSIZE){
      var r1 = this.population[randomInt(this.population.length-1)];
      var r2 = this.population[randomInt(this.population.length-1)];
      this.population.push(breed(r1,r2));

    }
    this.generation++;
    this.population.sort(function(x,y){
      if(x.fitness>y.fitness){
        return -1;
      }else{
        return 1;
      }
    });

  }


  this.evaluate=function(n){
    for(var i=0;i<n;i++){
      this.nextGeneration();
    }
  }




  function Organism(options){
    this.dna = optToDna(options,8);
    this.options = options;
    this.keys=[];
    for(var key in options){
      this.keys.push(key);
    }

    this.fitness = fitness(options);
  }


  function optToDna(options,length){
    var features = [];
    var keys = [];
    var dna=[];
    for(var key in options){
      keys.push(key);
      features.push(options[key]);
    }
    for(var i = 0; i < features.length; i++){
      dna = dna.concat(decToBin(features[i],length));
    }
    return dna;
  }



  function dnaToOpt(dna,keys){
    var options = {};

    var sliced = [];


    var l = dna.length/keys.length;
    var p = 0;
    while(p < dna.length){
      sliced.push(dna.slice(p,p+l));
      p+=l;
    }
    for(var i = 0; i < sliced.length; i++){
      options[keys[i]] = binToDec(sliced[i]);
    }

    return options
  }

  function breed(o1,o2){
    var nn = mutation(crossover(o1.dna,o2.dna));
    return new Organism(dnaToOpt(nn,o1.keys));

    function crossover(dna1,dna2){
      var dna = [];
      var l = dna1.length;
      var t = Math.floor(l/2);
      for(var i = 0; i < t; i++){
        dna.push(dna1[i]);
      }
      for(var i = t; i < dna2.length; i++){
        dna.push(dna2[i]);
      }
      return dna;
    }



    function mutation(dna){
      var rnd=0.05;
      for(var i=0;i<dna.length;i++){
        if(Math.random()<rnd){
          dna[i] ^= dna[i];
        }
      }
      return dna;
    }

  }







  function randomInt(max){
    return Math.round(Math.random()*max);
  }


  function decToBin(val,padding){
    var out=[];
    while(val > 0){
      if((val % 2) == 0){
        out.push(0);
      }else{
        out.push(1);
      }
      val=Math.floor(val/2);
    }
    out=out.reverse();

    if(padding!=null){
        while(out.length<padding){
          out.unshift(0);
        }
    }

    return out;
  }

  function binToDec(bins){
    var arr = bins.reverse();
    var out = 0;
    for(var i = 0; i < arr.length; i++){
      if(arr[i]==1){
        out+=Math.pow(2,i);
      }
    }
    return out;
  }


}
