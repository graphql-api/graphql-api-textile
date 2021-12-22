import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Client } from '@textile/hub'
import { Collection } from '@textile/threaddb'

export class ThreadDataSource<D = any> extends MongoDataSource<D> {}

const c = await Client.withUserAuth()

const d = new MongoDataSource(({} as unknown) as Collection)
