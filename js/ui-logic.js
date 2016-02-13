var setupPizzaBuilder = function(pizza) {
  $(".topping-checkboxes").empty();
  $(".working-toppings").empty();
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
  $("#" + pizza.pizzaSize).prop("checked", true)
  $("input[value='cheese']").prop("checked", true);
  pizza.pizzaToppings.push("cheese");
  addToppingToPizzaBuilderList("cheese");
  updatePizzaCost(pizza);
  beginSizeListener(pizza);
  beginToppingListener(pizza);
};

var beginSizeListener = function(pizza) {
  $(".pizza-size").change(function() {
    pizza.pizzaSize = $(this).val();
    $(".working-size").empty().append(pizza.pizzaSize);
    updatePizzaCost(pizza);
  });
}

var beginToppingListener = function(pizza) {
  $(".pizza-topping").change(function() {
    var thisTopping = $(this).val();
    if (pizza.pizzaToppings.indexOf(thisTopping) > -1) {
      pizza.removeTopping(thisTopping);
      removeToppingFromPizzaBuilderList(thisTopping);
    } else {
      pizza.pizzaToppings.push(thisTopping);
      addToppingToPizzaBuilderList(thisTopping);
    }
    updatePizzaCost(pizza);
  });
}

var addToppingToPizzaBuilderList = function(topping) {
  $(".working-toppings").append("<li class='working-topping'>" + topping + "</li>");
};

var removeToppingFromPizzaBuilderList = function(topping) {
  $(".working-topping:contains(" + topping + ")").remove();
};

var updatePizzaCost = function(pizza) {
  $(".working-cost").empty().append(formatCost(pizza.cost()));
};

var updateOrderList = function(order) {
  $(".order-pizzas").empty();
  for (var eachPizza of order.pizzas) {
    $(".order-pizzas").append(
      "<div class='order-pizza'>" +
        "<strong>" + eachPizza.pizzaSize + "&nbsp;Pizza</strong> " +
        "<ul class='list-inline order-pizza-toppings' id='toppings"+ eachPizza.pizzaId + "'></ul>" +
        formatCost(eachPizza.cost()) +
        "<br><button class='btn btn-link' id='" + eachPizza.pizzaId + "'>Remove</button>" +
      "</div>"
    );
    for (var topping of eachPizza.pizzaToppings) {
      $("#toppings" + eachPizza.pizzaId).append("<li>" + topping + "</li>");
    }
  }
};

var updateOrderCost = function(order) {
  $(".order-total-cost").empty().append(formatCost(order.cost()));
};

var updateOrder = function(order) {
  updateOrderList(order);
  updateOrderCost(order);
  if (order.pizzas.length === 0) {
    $(".current-order").hide();
  } else {
    $(".current-order").show();
  }
}

var deliveryListener = function(order) {
  $(".order-type").change(function() {
    var orderType = $(this).val();
    if (orderType === "delivery") {
      order.delivery = true;
      if (DELIVERY_CHARGE > 0) {
        $(".delivery-charge").append("<p>A delivery charge of " +
          formatCost(DELIVERY_CHARGE) + " will be added to your order. This delivery charge is not a tip paid to your driver.</p>"
        );
      }
      $(".address-inputs").show();
    } else {
      order.delivery = false;
      $(".delivery-charge").empty();
      $(".address-inputs").hide();
    }
    updateOrderCost(order);
  });
}

//DOCUMENT READY

$(function() {

  var pizzaIdCounter = 0;
  var workingOrder = new Order();
  var workingPizza = new Pizza(pizzaIdCounter, "Medium");
  setupPizzaBuilder(workingPizza);
  deliveryListener(workingOrder);

  //add pizza to order
  $("#add-to-order").on("submit", function(event) {
    event.preventDefault();
    workingOrder.addPizza(workingPizza);
    updateOrder(workingOrder);
    pizzaIdCounter++;
    workingPizza = new Pizza(pizzaIdCounter, "Medium");
    setupPizzaBuilder(workingPizza);
  });

  //remove pizza from order
  $(document).on('click', '.btn-link', function() {
    var indexToRemove = workingOrder.pizzas.findIndex(function(elem, index, array) {
      return elem.pizzaId === $(this).prop("id");
    });
    workingOrder.pizzas.splice(indexToRemove, 1);
    updateOrder(workingOrder);
  });

  //finalize order
  $(".lightbox").on("submit", function(event) {
    event.preventDefault();

    $('.backdrop, .box').animate({'opacity':'.50'}, 100, 'linear');
    $('.box').animate({'opacity':'1.00'}, 100, 'linear');
    $('.backdrop, .box').css('display', 'block');
    if (workingOrder.delivery) {
      $(".confirmation").append("Your order has been confirmed!<br><br>If Epic Pizza were real, it would be on its way to " + $("#inputAddress1").val() + " in 30 minutes or less!<br><br>");
    } else {
      $(".confirmation").append("Your order has been confirmed!<br><br>If Epic Pizza were real, it would be available for carryout in 30 minutes or less!<br><br>");
    }
    $(".confirmation").append(" Your order total is " + formatCost(workingOrder.cost()) + ".");
  });

  $(".close").on("click", function() {
    window.location.reload(true);
  });

  $(".backdrop").on("click", function() {
    window.location.reload(true);
  });
});
