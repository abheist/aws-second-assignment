import 'source-map-support/register'

import * as uuid from 'uuid'

import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate'
import {CreateTodoRequest} from '../requests/CreateTodoRequest'
import {UpdateTodoRequest} from '../requests/UpdateTodoRequest'
import {createLogger} from '../utils/logger'
import {TodosAccess} from "./todosAcess";
import {TodosStorage} from './todosStorage'

const logger = createLogger('todos')

const todosAccess = new TodosAccess()
const todosStorage = new TodosStorage()

export async function getTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`Retrieving all todos for user ${userId}`, {userId})

    return await todosAccess.getTodoItems(userId)
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4()

    const newItem: TodoItem = {
        userId, todoId, createdAt: new Date().toISOString(), done: false, attachmentUrl: null, ...createTodoRequest
    }

    logger.info(`Creating todo ${todoId} for user ${userId}`, {userId, todoId, todoItem: newItem})

    await todosAccess.createTodoItem(newItem)

    return newItem
}

export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest) {
    logger.info(`Updating todo ${todoId} for user ${userId}`, {userId, todoId, todoUpdate: updateTodoRequest})

    const item = await todosAccess.getTodoItem(todoId)

    if (!item) throw new Error('Item not found')

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to update todo ${todoId}`)
        throw new Error('User is not authorized to update item')
    }

    todosAccess.updateTodoItem(todoId, updateTodoRequest as TodoUpdate).then(() => logger.info(`Todo Item ${todoId} updated`))
}

export async function deleteTodo(userId: string, todoId: string) {
    logger.info(`Deleting todo ${todoId} for user ${userId}`, {userId, todoId})

    const item = await todosAccess.getTodoItem(todoId)

    if (!item) throw new Error('Item not found')

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to delete todo ${todoId}`)
        throw new Error('User is not authorized to delete item')
    }

    todosAccess.deleteTodoItem(todoId).then(() => logger.info(`Todo item ${todoId} deleted`))
}

export async function updateAttachmentUrl(userId: string, todoId: string, attachmentId: string) {
    logger.info(`Generating attachment URL for attachment ${attachmentId}`)
    const attachmentUrl = await todosStorage.getAttachmentUrl(attachmentId)

    logger.info(`Updating todo ${todoId} with attachment URL ${attachmentUrl}`, {userId, todoId})

    const item = await todosAccess.getTodoItem(todoId)

    if (!item) throw new Error('Item not found')
    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to update todo ${todoId}`)
        throw new Error('User is not authorized to update item')
    }

    await todosAccess.updateAttachmentUrl(todoId, attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {
    logger.info(`Upload URL for attachment ${attachmentId}`)

    return await todosStorage.getUploadUrl(attachmentId)
}