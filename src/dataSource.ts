import { DataSource } from 'apollo-datasource'
import { Buckets, Client, createUserAuth, PrivateKey, Users, UserMessage } from '@textile/hub'
import type { GetThreadResponse } from '@textile/hub-threads-client'

const USER_API_KEY = process.env.TEXTILE_USER_API_KEY
const USER_API_SECRET = process.env.TEXTILE_USER_API_SECRET

const keyInfo = { key: USER_API_KEY, secret: USER_API_SECRET }

const userAuth = () => createUserAuth(USER_API_KEY, USER_API_SECRET)

export class TextileDataSource extends DataSource {
  buckets: Promise<Buckets> | Buckets
  threads: Promise<Client> | Client
  users: Promise<Users> | Users
  // buckets: Buckets
  // threads: Client
  // users: Users
  constructor() {
    super()
    this.buckets = Buckets.withKeyInfo(keyInfo)
    this.threads = Client.withKeyInfo(keyInfo)
    this.users = Users.withKeyInfo(keyInfo)
    // this.buckets = Buckets.withUserAuth(userAuth)
    // this.threads = Client.withUserAuth(userAuth)
    // this.users = Users.withUserAuth(userAuth)
  }

  /** @ts-ignore */
  async listThreads(): GetThreadResponse[] {
    const users = await this.users
    const response = await users.listThreads()
    return response
  }

  /** USERS */

  async generateToken() {
    const users = await this.users

    // const key = PrivateKey.fromString()
    // users.getToken()
  }

  async getUsage() {
    const users = await this.users
    users.getUsage()
  }

  async getUser() {
    const users = await this.users
    const userAuth = await createUserAuth(USER_API_KEY, USER_API_SECRET)
    const token = await users.getToken(PrivateKey.fromRandom())
    console.log('TOKEN', token.length, typeof token, token)
    return { ...userAuth, token }
  }

  async getMailBox(): Promise<{ inbox: UserMessage[]; sent: UserMessage[] }> {
    const user = await this.users
    return {
      inbox: await user.listInboxMessages(),
      sent: await user.listSentboxMessages()
    }
  }

  async setupMailBox() {
    const user = await this.users
    const hasMailBox = await user.getMailboxID()
    if (hasMailBox) return this.getMailBox()
    const mail = await user.setupMailbox()
    return this.getMailBox()
  }

  /** BUCKETS */

  async root({ thread, bucketKey }) {
    const buckets = await this.buckets
    await buckets.withThread(thread)
    const cid = await buckets.root(bucketKey)
  }

  async listBuckets() {
    const buckets = await this.buckets
    const user = await this.users
    const client = await this.threads
    const threadsList = await user.listThreads()
    let bucketList = []

    await Promise.all(
      threadsList.map(async (thread) => {
        try {
          const exist = await buckets.existing(thread.id)
          if (exist) bucketList.push(...exist)
        } catch (err) {
          console.log('EXIST ERROR', err)
        }
      })
    )
    return bucketList
  }

  async listBucketEntries({ thread, bucketKey, path = '/' }) {
    const buckets = await this.buckets
    await buckets.withThread(thread)
    console.time(bucketKey)
    const entries = await buckets.listPathFlat(bucketKey, path)
    console.timeEnd(bucketKey)

    return entries
  }

  /** THREADS */
}
