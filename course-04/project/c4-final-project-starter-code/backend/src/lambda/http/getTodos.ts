import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors} from 'middy/middlewares'

import {getTodos as getTodosForUser} from '../../businessLogic/todos'
import {getUserId} from '../utils';

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const userId = getUserId(event)
        const todos = await getTodosForUser(userId)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                todos
            })
        }
    }
)

handler.use(
    cors({
        credentials: true
    })
)
