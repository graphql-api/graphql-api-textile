import { GraphQLResolverMap } from 'apollo-graphql'
import { ApolloError } from 'apollo-server-core'
import { TextileDataSource } from '../dataSource'
import { DateTimeResolver } from 'graphql-scalars'
import GraphQLUpload from 'graphql-upload/public/GraphQLUpload.js'

const formatDate = (value: number) => new Date(Number(String(value).slice(0, 13)))

export const resolvers: GraphQLResolverMap<{ dataSources: { hub: TextileDataSource } }> = {
  Upload: GraphQLUpload,
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
  Query: {
    async bucketDirectory(root, { input: { path } }, { dataSources }) {
      // dataSources.hub.buckets.listPath(path)
    },
    async bucketFile(root, { input: { path } }, { dataSources }) {
      dataSources.hub.buckets
    },
    async bucket(root, args, { dataSources }) {},
    async listBuckets(root, args, { dataSources }) {
      return dataSources.hub.listBuckets()
    }
  },
  Mutation: {
    async createBucket() {},
    async addBucketFile(root, { input: { file } }, { dataSources }, info) {
      const bucketKey = ''
      const { filename, mimetype, createReadStream } = await file
      const stream = createReadStream()
      //   await dataSources.hub.buckets
      //     .pushPath(bucketKey, filename, stream)
      //     .catch((error) => new ApolloError(error))
    },
    async addBucketFiles(root, { files }, { dataSources }, info) {}
  }
}
