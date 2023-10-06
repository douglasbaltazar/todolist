package com.todolist.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.todolist.backend.model.ToDo;

public interface ToDoRepository extends JpaRepository<ToDo, String> {
	Optional<ToDo> findByName(String name);
	List<ToDo> findAllByOrderBySequenceAsc();
}
