package com.awesomeproject;

public class Beneficiary {
    private String id;
    private String name;
    // Add any other beneficiary properties as needed

    public Beneficiary(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    // Add getters and setters for other beneficiary properties if needed

    // Override toString() method to provide a meaningful string representation of the Beneficiary object
    @Override
    public String toString() {
        return "Beneficiary{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
