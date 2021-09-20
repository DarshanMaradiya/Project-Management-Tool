package io.agileintelligence.ppmtool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import io.agileintelligence.ppmtool.security.AppProperties;

@SpringBootApplication
@ComponentScan({"io.agileintelligence.ppmtool"})
public class PpmtoolApplication {

	public static void main(String[] args) {
		SpringApplication.run(PpmtoolApplication.class, args);
	}

	@Bean
    public AppProperties appProperties() {
        return new AppProperties();
    }

}
