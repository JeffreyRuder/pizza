function Pizza() {
  this.pizzaToppings = ["cheese"];
  this.pizzaSize;
};

var sizeCosts = {
  "small": 800,
  "medium": 1000,
  "large": 1200
};

var toppingCosts = {
  "cheese": 0,
  "extra cheese": 50,
  "anchovies": 75,
  "mushrooms": 25,
  "pepperoni": 50,
  "sausage": 100
};

Pizza.prototype.cost = function () {
  var runningTotal = sizeCosts[this.pizzaSize];
  for (var topping of this.pizzaToppings) {
    runningTotal += toppingCosts[topping];
  }
  return runningTotal;
};

Pizza.prototype.removeTopping = function (topping) {
  var toppingIndex = this.pizzaToppings.indexOf(topping);
  if (toppingIndex > -1)  {
    this.pizzaToppings.splice(toppingIndex, 1);
  }
};

var formatCost = function(cost) {
  return "$" + (cost / 100).toFixed(2);
};

//USER INTERFACE

var populateToppings = function() {
  for (var topping in toppingCosts) {
    if (toppingCosts.hasOwnProperty(topping)) {
      $(".topping-checkboxes").append(
        "<div class='checkbox'>" +
          "<label>" +
            "<input type='checkbox' class='pizza-topping' value='" + topping + "'>" + topping + " (" + formatCost(toppingCosts[topping]) + ")" +
          "</label>" +
        "</div>"
      );
    }
  }
  $("input[value='cheese']").attr("checked", true);
};

var appendToppingToList = function(topping) {
  $(".working-toppings").append("<li class='working-topping'>" + topping + "</li>");
};

var removeToppingFromList = function(topping) {
  $(".working-topping:contains(" + topping + ")").remove();
}

//DOCUMENT READY

$(function() {

  var workingPizza = new Pizza;
  workingPizza.pizzaSize = "medium";

  populateToppings();
  appendToppingToList("cheese");

  $(".pizza-size").change(function() {
    workingPizza.pizzaSize = $(this).val();
    $(".working-cost").empty().append(formatCost(workingPizza.cost()));
  });

  $(".pizza-topping").change(function () {
    var thisTopping = $(this).val();
    console.log(thisTopping);
    if (workingPizza.pizzaToppings.indexOf(thisTopping) > -1) {
      workingPizza.removeTopping(thisTopping);
      removeToppingFromList(thisTopping);
      $(".working-cost").empty().append(formatCost(workingPizza.cost()));
    } else {
      workingPizza.pizzaToppings.push(thisTopping);
      console.log(workingPizza.pizzaToppings);
      appendToppingToList(thisTopping);
      $(".working-cost").empty().append(formatCost(workingPizza.cost()));
    }
  });


});
