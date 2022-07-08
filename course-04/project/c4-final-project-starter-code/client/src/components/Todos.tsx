import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Button, Checkbox, Divider, Grid, Header, Icon, Image, Input, Loader } from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
}

export const Todos = (props: TodosProps) => {
  let [todosState, setTodosState] = useState<TodosState>({
    todos: [],
    newTodoName: '',
    loadingTodos: true
  })

  const onEditButtonClick = (todoId: string) => {
    props.history.push(`/todos/${todoId}/edit`)
  }


  const renderCreateTodoInput = () => {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: onTodoCreate
            }}
            fluid
            actionPosition='left'
            placeholder='To change the world...'
            value={todosState.newTodoName}
            onChange={(event) => setTodosState({ ...todosState, newTodoName: event.target.value })}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  const renderTodos = () => {
    if (todosState.loadingTodos) {
      return renderLoading()
    }

    return renderTodosList()
  }

  const renderLoading = () => {
    return (
      <Grid.Row>
        <Loader indeterminate active inline='centered'>
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  const renderTodosList = () => {
    return (
      <Grid padded>
        {todosState.todos.length > 0 && todosState.todos.map((todo, pos) => {
          if (!todo) {
            return null;
          }
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={1} verticalAlign='middle'>
                <Checkbox
                  onChange={() => onTodoCheck(pos)}
                  checked={todo.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign='middle'>
                {todo.name}
              </Grid.Column>
              <Grid.Column width={3} floated='right'>
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated='right'>
                <Button
                  icon
                  color='blue'
                  onClick={() => onEditButtonClick(todo.todoId)}
                >
                  <Icon name='pencil' />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated='right'>
                <Button
                  icon
                  color='red'
                  onClick={() => onTodoDelete(todo.todoId)}
                >
                  <Icon name='delete' />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size='small' wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  const calculateDueDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }

  const onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = calculateDueDate()
      if (!todosState.newTodoName) {
        alert('Todo can\'t be empty')
        return;
      }
      const newTodo = await createTodo(props.auth.getIdToken(), {
        name: todosState.newTodoName,
        dueDate
      })
      setTodosState({
        ...todosState,
        todos: [...todosState.todos, newTodo],
        newTodoName: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  const onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(props.auth.getIdToken(), todoId)
      setTodosState({
        ...todosState,
        todos: todosState.todos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  const onTodoCheck = async (pos: number) => {
    try {
      const todo = todosState.todos[pos]
      await patchTodo(props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      setTodosState({
        ...todosState,
        todos: update(todosState.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  useEffect(() => {
    try {
      getTodos(props.auth.getIdToken()).then((data) => {
        console.log({ data })
        setTodosState({
          ...todosState,
          todos: data || [],
          loadingTodos: false
        })
      })
    } catch (e: any) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }, [])

  return (
    <div>
      <Header as='h1'>TODOs</Header>

      {renderCreateTodoInput()}

      {renderTodos()}
    </div>
  )
}
