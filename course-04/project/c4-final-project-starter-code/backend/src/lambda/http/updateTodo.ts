import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'

// import {updateTodo} from '../../businessLogic/todos'
import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {getUserId} from '../utils'
import {updateTodo} from "../../businessLogic/todos";

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const todoId = event.pathParameters.todoId
        const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
        const userId = getUserId(event)

        await updateTodo(userId, todoId, updatedTodo)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
