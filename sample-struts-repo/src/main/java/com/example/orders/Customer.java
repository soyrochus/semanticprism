package com.example.orders;

public class Customer {
  private final String id;
  private final double creditLimit;

  public Customer(String id, double creditLimit) {
    this.id = id;
    this.creditLimit = creditLimit;
  }

  public String getId() {
    return id;
  }

  public double getCreditLimit() {
    return creditLimit;
  }
}
