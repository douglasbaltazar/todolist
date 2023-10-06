package com.todolist.backend.controller;

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
import com.todolist.backend.model.ToDo;
import com.todolist.backend.repository.ToDoRepository;

@RestController
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
@RequestMapping("/api/v1/todos")
public class ToDoController {

	@Autowired
	private ToDoRepository todoRepository;
	
	// getToDos
	@GetMapping()
	public List<ToDo> getAllToDos() {
		return this.todoRepository.findAllByOrderBySequenceAsc();
	}
	
	// getToDoById
	
	@GetMapping("/{id}")
	public ResponseEntity<ToDo> getToDoById(@PathVariable(value = "id") String todoId) throws ResourceNotFoundException  {
		ToDo todo = todoRepository.findById(todoId)
				.orElseThrow(() -> new ResourceNotFoundException("Não foi encontrado um ToDo com o Id: " + todoId));
		return ResponseEntity.ok().body(todo);

	}
	
	// Save ToDo
	@PostMapping()
	public ResponseEntity<?> createToDo(@RequestBody ToDo todo) {
	    Optional<ToDo> checkToDo = todoRepository.findByName(todo.getName());
	    if(checkToDo.isPresent()) {
	    	return ResponseEntity.status(HttpStatus.CONFLICT).body("Já existe um ToDo com o mesmo nome.");
	    }
	    int numberOfTasks = todoRepository.findAll().size();
	    todo.setSequence(numberOfTasks + 1);
	    ToDo createdToDo = this.todoRepository.save(todo);
	    

	    return ResponseEntity.status(HttpStatus.CREATED).body(createdToDo);
	}
	
	// Update ToDo
	@PutMapping("/{id}")
	public ResponseEntity<?> updateToDo(@PathVariable(value = "id") String todoId,
			@Validated @RequestBody ToDo todoUpdate) throws ResourceNotFoundException {
		/*
		 * # Editar
			A função deve editar o registro da Tarefa escolhida.
			Só é possível alterar o "Nome da Tarefa", o "Custo" e a "Data Limite".
			É necessário verificar se o novo nome da tarefa já existe na base de dados. Se já existir, a alteração não poderá ser feita.
			A implementação pode ser feita de uma das duas formas abaixo (escolha uma):
			A edição é feita diretamente na tela principal (Lista de Tarefas), onde os três campos são habilitados para edição.
			ou
			É aberta uma nova tela (popup) para edição dos três campos.
		 * 
		 */

		ToDo todo = todoRepository.findById(todoId)
				.orElseThrow(() -> new ResourceNotFoundException("Não foi encontrado um ToDo com o Id: " + todoId));
	    Optional<ToDo> checkToDo = todoRepository.findByName(todoUpdate.getName());
	    if(checkToDo.isPresent()) {
	    	return ResponseEntity.status(HttpStatus.CONFLICT).body("Já existe um ToDo com o mesmo nome.");
	    }
		todo.setLimitDate(todoUpdate.getLimitDate());
		todo.setName(todoUpdate.getName());
		todo.setValue(todoUpdate.getValue());
		
		return ResponseEntity.ok(this.todoRepository.save(todo));
	}
	
	// Remove ToDo
	@DeleteMapping("/{id}")
	public Map<String, Boolean> deleteToDo(@PathVariable(value = "id") String todoId) throws ResourceNotFoundException {
		ToDo todo = todoRepository.findById(todoId)
				.orElseThrow(() -> new ResourceNotFoundException("Não foi encontrado um ToDo com o Id: " + todoId));
		this.todoRepository.delete(todo);
		
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return response;
	}
	
	// Alterar Ordens
}
