/* eslint-disable @typescript-eslint/no-unused-vars */

import { User } from '@prisma/client'
import { FastifyRequest } from 'fastify'
import { Webhook } from 'svix'

import { WebHookData } from '@/routes/webhook/clerk/create-user'
import { IUpdateUserService } from '@/services/users/update-user'

import { BadRequest } from '../../routes/_errors/errors-instance'
import { ICreateUserService } from '../../services/users/create-user'

interface IUpdateUserController {
  execute(json: WebHookData, request: FastifyRequest): Promise<User>
}

export class UpdateUserController implements IUpdateUserController {
  constructor(private updateUserService: IUpdateUserService) {}
  async execute(json: WebHookData, request: FastifyRequest) {
    const updateUserEvent = json.type == 'user.updated'

    if (!updateUserEvent) {
      throw new BadRequest('This event is not allowed')
    }
    // const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET as string

    // const headers = request.headers
    // const payload = request.body

    // const svix_id = headers['svix-id'] as string
    // const svix_timestamp = headers['svix-timestamp'] as string
    // const svix_signature = headers['svix-signature'] as string

    // if (!svix_id || !svix_timestamp || !svix_signature) {
    //   throw new BadRequest('Error occurred -- no svix headers')
    // }

    // try {
    //   const wh = new Webhook(WEBHOOK_SECRET)
    //   wh.verify(JSON.stringify(payload), {
    //     'svix-id': svix_id,
    //     'svix-timestamp': svix_timestamp,
    //     'svix-signature': svix_signature,
    //   })
    // } catch (err: any) {
    //   throw new BadRequest(`Webhook Error: ${err.message}`)
    // }

    if (!json.data) {
      throw new BadRequest('INVALID_WEBHOOK_PARAMS')
    }

    let id: string
    let firstName: string
    let lastName: string
    let email: string

    try {
      id = json.data.id
      firstName = json.data.first_name ?? null
      lastName = json.data.last_name ?? null
      email = json.data.email_addresses[0].email_address ?? null
    } catch (e) {
      console.error('Error to get user params:', e)
      throw new BadRequest('Error to get User Params')
    }

    if (!id) {
      throw new BadRequest('INVALID_WEBHOOK_PARAMS')
    }

    const updatedUser = await this.updateUserService.execute({
      id,
      firstName,
      lastName,
      email,
    })

    return updatedUser
  }
}
