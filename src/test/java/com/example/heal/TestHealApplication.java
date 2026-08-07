package com.example.heal;

import org.springframework.boot.SpringApplication;

public class TestHealApplication {

	public static void main(String[] args) {
		SpringApplication.from(HealApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
