import { v4 as uuid } from 'uuid'
import fs from 'fs'
const workspaceRoot = require('@nrwl/workspace/src/utils/app-root').appRootPath

const UPLOAD_DIR = workspaceRoot + '/uploads'

export async function storeUpload(upload) {
  const { createReadStream, filename, mimetype } = await upload
  const stream = createReadStream()
  const id = uuid()
  const path = `${UPLOAD_DIR}/${id}-${filename}`
  const file = { id, filename, mimetype, path }

  // Store the file in the filesystem.
  await new Promise((resolve, reject) => {
    // Create a stream to which the upload will be written.
    const writeStream = fs.createWriteStream(path)

    // When the upload is fully written, resolve the promise.
    writeStream.on('finish', resolve)

    // If there's an error writing the file, remove the partially written file
    // and reject the promise.
    writeStream.on('error', (error) => {
      fs.unlink(path, () => {
        reject(error)
      })
    })

    // In Node.js <= v13, errors are not automatically propagated between piped
    // streams. If there is an error receiving the upload, destroy the write
    // stream with the corresponding error.
    stream.on('error', (error) => writeStream.destroy(error))

    // Pipe the upload into the write stream.
    stream.pipe(writeStream)
  })

  // Record the file metadata in the DB.
  // db.get('uploads').push(file).write()

  return file
}
