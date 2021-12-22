import * as busboy from 'busboy'
import { NextApiRequest } from 'next'

const HIGH_WATER_MARK = 1024 * 1024 * 3

type UploadFunctionArgs = {
  fieldname: string
  file: NodeJS.ReadableStream
  filename: string
  encoding: string
  mimetype: string
}
type UploadFunction = (arg: UploadFunctionArgs) => void

type ErrorFunction = (arg: { message: string }) => void

export const createStream = (
  request: NextApiRequest,
  upload: UploadFunction,
  error = function (e) {
    throw new Error(e.message)
  }
) => {
  const b = new busboy.default({
    headers: request.headers,
    highWaterMark: HIGH_WATER_MARK
  })
  return new Promise<void>((res, rej) => {
    b.on('file', async function (fieldname, file, filename, encoding, mimetype) {
      await upload({ fieldname, file, filename, encoding, mimetype })
      return res()
    })

    b.on('error', error)

    return request.pipe(b)
  })
}
