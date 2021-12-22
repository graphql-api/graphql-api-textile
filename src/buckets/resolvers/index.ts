import { ApolloError } from 'apollo-server-core'
import { DateTimeResolver } from 'graphql-scalars'
import { Mutation } from './Mutation'
import { Resolvers } from './types'
import { Query } from './Query'

const formatDate = (value: number) => new Date(Number(String(value).slice(0, 13)))

export const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  Bucket: {
    async links(root, args, { dataSources }) {
      try {
        const buckets = await dataSources.hub.buckets
        await buckets.withThread(root.thread)
        const links = await buckets.links(root.key)
        return { __typename: 'BucketLinks', ...links }
      } catch (err) {
        new ApolloError(err)
      }
      return null
    },
    createdAt(root) {
      return root.createdAt ? formatDate(root.createdAt) : null
    },
    updatedAt(root) {
      return root.updatedAt ? formatDate(root.updatedAt) : null
    },
    async connection(root, _, { dataSources }) {
      const entries = await dataSources.hub.listBucketEntries({
        thread: root.thread,
        bucketKey: root.key
      })
      console.log('CONNECTION', entries)
      return { edges: [], children: [] }
    }
  },
  Query,
  Mutation
}
