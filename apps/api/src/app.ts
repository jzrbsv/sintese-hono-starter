import createApp from './lib/create-app'
import configureOpenAPI from './lib/openapi'
import auth from './routes/auth'
import index from './routes'

const app = createApp()
configureOpenAPI(app)

app.route('/', index)
app.route('/auth', auth)
export default app
