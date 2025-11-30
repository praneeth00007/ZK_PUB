package com.zkpub.in;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

import com.zkpub.in.model.User;
import com.zkpub.in.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class ZkPubbackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZkPubbackendApplication.class, args);
		System.out.println("project is running...");
	}

	@EventListener(ContextRefreshedEvent.class)
	public void ensureDefaultAdmin(ContextRefreshedEvent event) {
		UserRepository userRepository = event.getApplicationContext().getBean(UserRepository.class);
		if (userRepository.countByRole(User.Role.ADMIN) == 0) {
			BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
			User admin = new User();
			admin.setEmail("admin@zkpub.in");
			admin.setUsername("admin");
			admin.setPassword(encoder.encode("admin123"));
			admin.setRole(User.Role.ADMIN);
			userRepository.save(admin);
		}
	}
}
