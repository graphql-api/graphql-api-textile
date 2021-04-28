import { IResolvers } from 'apollo-server-micro'
import { ApolloError } from 'apollo-server-core'
import { GraphQLUpload } from 'graphql-upload'
import { GraphQLResolverMap } from 'apollo-graphql'
import { TextileDataSource } from '../dataSource'
import { DateTimeResolver } from 'graphql-scalars'

const formatDate = (value: number) => new Date(Number(String(value).slice(0, 13)))

export const resolvers: GraphQLResolverMap<{ dataSources: { hub: TextileDataSource } }> = {
  Upload: GraphQLUpload,
  DateTime: DateTimeResolver,
  Bucket: {
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
    async folder(root, { path }, { dataSources }) {
      // dataSources.hub.buckets.listPath(path)
    },
    async file(root, { name }, { dataSources }) {
      dataSources.hub.buckets
    },
    async buckets(root, args, { dataSources }) {
      return dataSources.hub.listBuckets()
    }
  },
  Mutation: {
    async addFile(root, { file }, { dataSources }, info) {
      const bucketKey = ''
      const { filename, mimetype, createReadStream } = await file
      const stream = createReadStream()
      //   await dataSources.hub.buckets
      //     .pushPath(bucketKey, filename, stream)
      //     .catch((error) => new ApolloError(error))
    }
    // async addFiles(root, { files }, { dataSources }, info) {}
  }
}
