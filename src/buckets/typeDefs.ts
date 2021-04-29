import { gql } from 'graphql-tag'

export const typeDefs = gql`
  scalar Upload
  scalar DateTime

  """
  Directory
  """
  type BucketDirectory implements BucketPath {
    cid: ID!
    path: String!
    name: String!
    isDir: Boolean
    count: Int
    size: Int
    paths: BucketPathConnection
    metadata: BuckMetadata
  }

  """
  File
  """
  type BucketFile implements BucketPath {
    cid: ID!
    path: String!
    name: String!
    filename: String!
    mimetype: String
    size: Int
    isDir: Boolean
    metadata: BuckMetadata
  }

  type BuckMetadata {
    updatedAt: Int
  }

  interface BucketPath {
    cid: ID!
    path: String!
    name: String!
    isDir: Boolean
    metadata: BuckMetadata
  }

  type BucketPathEdge {
    node: BucketPath
  }

  type BucketPathConnection {
    edges: [BucketPathEdge]
  }

  """
  Bucket
  """
  type Bucket {
    name: String
    createdAt: DateTime
    key: String
    path: String
    thread: String
    updatedAt: DateTime
    links: BucketLinks
    paths: BucketPathConnection
  }

  type BucketLinks {
    www: String
    ipns: String
    url: String
  }

  type Query {
    bucketDirectory(input: BucketPathInput!): BucketDirectory
    bucketFile(input: BucketPathInput!): BucketFile
    bucket(input: BucketInput): Bucket
    listBuckets: [Bucket]
  }

  input BucketInput {
    key: String
    thread: String
  }

  input BucketPathInput {
    path: String
    key: String
    thread: String
  }

  type Mutation {
    createBucket(input: CreateBucketInput!): Bucket
    addBucketFile(input: AddBucketFileInput!): BucketFile
    addBucketFiles(input: [AddBucketFileInput]!): [BucketFile]
  }

  input CreateBucketInput {
    name: String
  }

  input AddBucketFileInput {
    file: Upload
  }
`
