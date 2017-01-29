#!/usr/bin/env node

'use strict';

const customers = require("./data/customers.json");
const ld = require("lodown-meryldakin");


/**
 * 1. Import your lodown module using the require() method, 
 *    using the string 'lodown-<my-username>', or whatever 
 *    name with which you published your npm lodown project.
 * 
 * 2. Solve all problems as outlined in the README.
 */
 

// number males  
function numberMales(array){

  return ld.filter(array, function(element, index, array){
      return (element.gender === "male");
    }).length;
  
}
//number females  

function numberFemales(array){

  return ld.filter(array, function(element, index, array){
      return (element.gender === "female");
    }).length;
  
} 
//oldest customer, youngest customer in one function
  
function oldestYoungest(array){
  let ageArr = ld.pluck(array, "age").sort(function (a, b){
    return a - b;
  });
  let oldest = ageArr.pop();
  let youngest = ageArr.shift();
  
  let oldAndYoung = ld.pluck(ld.filter(array, function(element, index, array){
    return (element.age === youngest || element.age === oldest)
  }), "name");
}
  
// oldest customer
  
function oldestCustomer(array){
  let ageArr = ld.pluck(array, "age").sort((a, b) => a - b);
  
  return ld.pluck(ld.filter(array, (element, index, array) =>
    (element.age === ageArr[ageArr.length -1])), "name");     
}

// youngest customer

function youngestCustomer(array){
  let ageArr = ld.pluck(array, "age").sort((a, b) => a - b);
  
  return ld.pluck(ld.filter(array, (element, index, array) =>
    (element.age === ageArr[0])), "name");     
}
  

  
//average balance

function averageBalance(array){
  let balanceArray = ld.map(ld.pluck(array, "balance"), function(element, index, array){
    return Number(element.replace(/[^0-9\.]+/g,""));
  });
  let sum = ld.reduce(balanceArray, function (prev, curr, index){
    return prev + curr;
  }) / balanceArray.length;
  
  return "$" + Math.round(sum * 100) / 100;
  
}

//how many customer's names begin with some letter

function customerNameBegins (array, character){
  return ld.filter(array, function(element, index, array){
    return element.name[0].toLowerCase() === character.toLowerCase();
  }).length;
}





//how many customer's friend's names begin with some letter

function friendNameBegins (array, customerName, character){
  let targetName = ld.filter(array, (element, index, array) => element.name === customerName);
  return ld.filter(targetName[0].friends, (element, index, array) => element.name[0].toLowerCase() === character.toLowerCase()).length;
}

//how many customers are friends - you want to check how many of those people exist in the friends arrays of the customers

function customerConnections (collection){
  let customerFriends = {};
  let isFriend = false;
  let friendList = ld.pluck(collection, "name");
  ld.each(friendList, (element, index, array) => customerFriends[element] = isFriend);
  let allFriends = ld.pluck(collection, "friends");
  let friendNames = ld.map(allFriends, function(element, index, array){
    return ld.pluck(element, "name");
  });
  let flattenedNames = ld.reduce(friendNames, function(prev, curr, seed){
    return prev.concat(curr);
  });
  ld.each(friendList, function(element, index, array){
    if (flattenedNames.includes(element)){
      customerFriends[element] = true;
    }
  });
  let howManyFriends = ld.filter(customerFriends, (element, index, array) => element === true).length;
  return howManyFriends;
}


//users have tags associated with them: find the top 3 most common tags
//create a summary of genders
function genderBreakdown(array){
  let genderObject = {};
  function numberTrans(array){
    return ld.filter(array, function(element, index, array){
      return (element.gender === "transgender");
    }).length;
  }
  genderObject.male = numberMales(array);
  genderObject.female = numberFemales(array);
  genderObject.transgender = numberTrans(array);
  return genderObject;
}
  
