package com.example.orders;

public class OrderForm {
  private String customerId;
  private double orderTotal;

  public String getCustomerId() {
    return customerId;
  }

  public void setCustomerId(String customerId) {
    this.customerId = customerId;
  }

  public double getOrderTotal() {
    return orderTotal;
  }

  public void setOrderTotal(double orderTotal) {
    this.orderTotal = orderTotal;
  }
}
