import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {deleteTodo} from '../../businessLogic/todos'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const todoId = event.pathParameters.todoId
        const userId = event.pathParameters.todoId

        await deleteTodo(userId, todoId)

        return {
            statusCode: 204,
            headers: {
                'Allow-Control-Allow-Origin': '*'
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
