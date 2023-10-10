import mongoose from 'mongoose'
import app from './app'
import config from './config'

async function main() {
  try {
    await mongoose.connect(config.db_url as string)
    console.log('Database connection established')

    app.listen(config.port, () => {
      console.log(`${config.port} is working`)
    })
  } catch (error) {
    console.log(`${error} is here`)
  }
}

main()
