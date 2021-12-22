import { ApolloClient, InMemoryCache, ApolloError } from '@apollo/client'
import { GraphQLResolverMap } from 'apollo-graphql'
import { DateTimeResolver } from 'graphql-scalars'
import { Buckets, Root, PathItem } from '@textile/hub'
import { collectUint8Arrays } from '../lib/collectUint8Arrays'

const BUCKETPATHCONNECTION = 'BucketPathConnection'
const BUCKETPATHEDGE = 'BucketPathEdge'

const getBucketPathEdge = (item: PathItem) => ({
  __typename: BUCKETPATHEDGE,
  node: { ...item, __typename: item.isDir ? 'BucketDirectory' : 'BucketFile' }
})

const display = (num) => console.log(`progress: ${num}`)

export type Resolvers<C = any> = GraphQLResolverMap<{
  cache: InMemoryCache
  client: ApolloClient<C>
}>

export const getLocalResolvers = (getBucketClient: () => Promise<Buckets>): Resolvers => ({
  DateTime: DateTimeResolver,
  Node: {},
  BucketPath: {},
  BucketDirectory: {},
  BucketFile: {},
  Bucket: {
    async links(root: Root) {
      const { key, thread } = root
      if (key && thread) {
        try {
          const buckets = await getBucketClient()
          await buckets.withThread(thread)
          buckets.links(key)
        } catch (error) {
          new ApolloError(error)
        }
      }
    },
    async paths(root: Root, args, { cache }) {
      const { key, thread } = root
      if (key && thread) {
        try {
          const buckets = await getBucketClient()
          await buckets.withThread(thread)
          const data = await buckets.listPath(key, '/')
          return {
            __typename: BUCKETPATHCONNECTION,
            edges: data.item?.items?.map((item) => ({ node: item }))
          }
        } catch (error) {
          new ApolloError(error)
        }
        return { __typename: BUCKETPATHCONNECTION, edges: [] }
      }
    }
  },
  Query: {
    async bucketFile(root, args) {
      console.log('BUCKETFILE', args)
      const path: string = args?.input.path
      if (path) {
        try {
          const buckets = await getBucketClient()

          const data = await buckets.pullIpfsPath(path, { progress: display })
          if (data && path.endsWith('.json')) {
            const value = await collectUint8Arrays(data)
            let str = ''
            for (var i = 0; i < value.length; i++) {
              str += String.fromCharCode(parseInt(value[i] as any))
            }
            const content = JSON.parse(str)
            console.log('JSON', content)
            return { __typename: 'BucketFile', path, content }
          }
        } catch (err) {
          new ApolloError(err)
        }
      }
      return null
    },
    async bucketDirectory(root, args) {
      if (args.input) {
        const { thread, key, path } = args?.input
        if (thread && key) {
          try {
            const buckets = await getBucketClient()
            await buckets.withThread(thread)
            const subPath = path.split('/').slice(3).join('/')
            const data = await buckets.listPath(key, subPath)
            return {
              ...data.item,
              paths: {
                __typename: BUCKETPATHCONNECTION,
                edges: data.item?.items?.map(getBucketPathEdge)
              }
            }
          } catch (error) {
            new ApolloError(error)
          }
        }
        return null
      }
    },
    async bucket(root, args) {
      if (args.input) {
        const { thread, key } = args?.input
        if (thread && key) {
          try {
            const buckets = await getBucketClient()
            await buckets.withThread(thread)
            const data = await buckets.listPath(key, '/')
            return {
              ...data.item,
              ...data.root,
              paths: {
                __typename: BUCKETPATHCONNECTION,
                edges: data.item?.items?.map(getBucketPathEdge)
              }
            }
          } catch (error) {
            new ApolloError(error)
          }
        }
      }
      return null
    }
  },
  Mutation: {
    async addBucketFile(root, args, context) {
      console.log(args)
      // const { key, path, file } = args.input
      // if (key && path && file) {
      //   try {
      //     const buckets = await getBucketClient()
      //     const result = await buckets.pushPath(key, path, file, { progress: display })
      //     return result.path
      //   } catch (error) {
      //     new ApolloError(error)
      //   }
      // }
    },
    async createBucket(root, args, context) {
      const { name, encrypted = undefined, cid = undefined } = args.input
      if (name && encrypted) {
        try {
          const buckets = await getBucketClient()
          const response = await buckets.create(name, { encrypted, cid })
          return {
            ...response.root,
            links: response.links
          }
        } catch (error) {
          new ApolloError(error)
        }
      }
      return null
    }
  }
})
