package io.agileintelligence.ppmtool.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String color;
    private String description;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public Badge(String name, String color, String description) {
		this.name = name;
		this.color = color;
		this.description = description;
	}
	public Badge() {
	}
	public void setName(String name) {
        this.name = name;
    }
    public Badge(Long id, String name, String color, String description) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.description = description;
    }
    public String getColor() {
        return color;
    }
    public void setColor(String color) {
        this.color = color;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}
