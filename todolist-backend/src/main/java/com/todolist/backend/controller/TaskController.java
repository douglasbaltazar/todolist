package com.todolist.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todolist.backend.exception.ResourceNotFoundException;
import com.todolist.backend.model.Task;
import com.todolist.backend.repository.TaskRepository;

@RestController
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
@RequestMapping("/api/v1/tasks")
public class TaskController {

	@Autowired
	private TaskRepository taskRepository;
	
	// getToDos
	@GetMapping()
	public List<Task> getAllTasks() {
		return this.taskRepository.findAllByOrderBySequenceAsc();
	}
	
	// getToDoById
	
	@GetMapping("/{id}")
	public ResponseEntity<Task> getTaskById(@PathVariable(value = "id") String todoId) throws ResourceNotFoundException  {
		Task todo = taskRepository.findById(todoId)
				.orElseThrow(() -> new ResourceNotFoundException("Não foi encontrado uma Task com o Id: " + todoId));
		return ResponseEntity.ok().body(todo);

	}
	
	// Save ToDo
	@PostMapping()
	public ResponseEntity<?> createTask(@RequestBody Task todo) {
	    Optional<Task> checkToDo = taskRepository.findByName(todo.getName());
	    if(checkToDo.isPresent()) {
	    	return ResponseEntity.status(HttpStatus.CONFLICT).body("Já existe uma Task com o mesmo nome.");
	    }
	    try {
	    	int maxNumber = Integer.parseInt(taskRepository.findMaxSequence());
	    	todo.setSequence(maxNumber + 1);
	    } catch(Exception e) {
	    	todo.setSequence(1);
	    }
	    
	    Task createdToDo = this.taskRepository.save(todo);
	    

	    return ResponseEntity.status(HttpStatus.CREATED).body(createdToDo);
	}
	
	// Update ToDo
	@PutMapping("/{id}")
	public ResponseEntity<?> updateTask(@PathVariable(value = "id") String todoId,
			@Validated @RequestBody Task todoUpdate) throws ResourceNotFoundException {
		Task todo = taskRepository.findById(todoId)
				.orElseThrow(() -> new ResourceNotFoundException("Não foi encontrado uma Task com o Id: " + todoId));
	    Optional<Task> checkToDo = taskRepository.findByName(todoUpdate.getName());
	    if(!todo.getName().equals(todoUpdate.getName())) {
	    	if(checkToDo.isPresent()) {
		    	return ResponseEntity.status(HttpStatus.CONFLICT).body("Já existe uma Task com o mesmo nome.");
		    }
	    }
		todo.setLimitDate(todoUpdate.getLimitDate());
		todo.setName(todoUpdate.getName());
		todo.setValue(todoUpdate.getValue());
		
		return ResponseEntity.ok(this.taskRepository.save(todo));
	}
	
	// Remove ToDo
	@DeleteMapping("/{id}")
	public Map<String, Boolean> deleteTask(@PathVariable(value = "id") String todoId) throws ResourceNotFoundException {
		Task todo = taskRepository.findById(todoId)
				.orElseThrow(() -> new ResourceNotFoundException("Não foi encontrado uma Task com o Id: " + todoId));
		this.taskRepository.delete(todo);
		
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return response;
	}
	
	// Alterar Ordens
	
	@PutMapping("/sequence")
	public ResponseEntity<?> updateSequence(@RequestBody List<Task> updatedTasks) {
	    List<Task> updatedTasksList = new ArrayList<>();
	    
	    for (Task todoUpdate : updatedTasks) {
	        try {
	            Task todo = taskRepository.findById(todoUpdate.getId())
	                .orElseThrow(() -> new ResourceNotFoundException("Não foi encontrado uma Task com o Id: " + todoUpdate.getId()));
	            
	            Optional<Task> checkToDo = taskRepository.findByName(todoUpdate.getName());

	            if (!todo.getName().equals(todoUpdate.getName())) {
	                if (checkToDo.isPresent()) {
	                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Já existe uma Task com o mesmo nome.");
	                }
	            }
	            todo.setSequence(todoUpdate.getSequence());
	            todo.setLimitDate(todoUpdate.getLimitDate());
	            todo.setName(todoUpdate.getName());
	            todo.setValue(todoUpdate.getValue());
	            
	            updatedTasksList.add(taskRepository.save(todo));
	        } catch (ResourceNotFoundException e) {
	            
	        }
	    }
	    
	    return ResponseEntity.ok(updatedTasksList);
	}
}
