package com.todolist.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.todolist.backend.model.Task;

public interface TaskRepository extends JpaRepository<Task, String> {
	
	Optional<Task> findByName(String name);
	
	List<Task> findAllByOrderBySequenceAsc();
	
	@Query("SELECT MAX(t.sequence) FROM Task t")
    String findMaxSequence();
}
